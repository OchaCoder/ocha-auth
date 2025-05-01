import { V4 } from "paseto";
import { config } from "../../config.js";
import { generateStaggeredExpiration } from "../../functions/generators/generate-staggered-expiration.js";
import { runRedis } from "../../functions/helpers/run-redis/index.js";
import { resolveUserIdFromBrowserId } from "../../functions/resolvers/resolve-user-id-from-browser-id.js";
/**
 * This glue route acts as both a proxy and an adapter:
 * - It forwards the payload to the intended internal route (proxy behavior)
 * - It adapts the final response by unwrapping nested success objects and attaching new AT/RT cookies (adapter behavior)
 *
 * Its purpose is to reduce frontend round trips by handling token refresh and request forwarding in a single operation.
 */
const overview = `
When the access token ('at') is refreshed using the refresh token ('rt') associated 
with the browser ID ('bid'), a new 'rt' is issued and stored in Redis.

However, the 'bid' cookie value remains unchanged — only its maxAge is updated 
to align with the new 'rt' expiry.

This is intentional: by preserving the cookie value but updating its TTL, 
we avoid the classic multi-tab issue during token rotation.

This approach ensures that all open browser tabs maintain a consistent expiration timeline, 
and no tab ends up with outdated tokens due to premature expiration.
`;
export const userRefreshAt = (fastify) => {
    return async (request, reply) => {
        // 1. Extract the browser ID and intended destination
        const { bid, path, payload } = request.body; // Guaranteed to match UserRefreshATSchema
        // 2. Get the refresh token, validate, verify, and parse. Throw appropriate error at different stages.
        const userId = await resolveUserIdFromBrowserId(fastify, reply, bid);
        // 3. Generate expiration values for Paseto, Redis, and cookies
        const exp = generateStaggeredExpiration();
        // 4: Sign new RT/AT
        const newAt = await V4.sign({ sub: JSON.stringify({ id: userId }) }, config.pasetoKeys.secret.at, { expiresIn: exp.at.pasetoExpiresIn });
        const newRt = await V4.sign({ sub: JSON.stringify({ id: userId }) }, config.pasetoKeys.secret.rt, { expiresIn: exp.rt.pasetoExpiresIn });
        // 5. Replace the old refresh token with the new one using the same browser ID
        await runRedis.fireAndForget(fastify, async () => await fastify.redis.set(`browserID:${bid}`, newRt, "EX", exp.rt.redisSetEX), userId);
        // 6-1-1. If a path is provided, forward the request to the internal route
        if (path) {
            const rawReply = await fastify.inject({
                method: "POST",
                url: path, // proxy the payload to this internal route.
                payload: {
                    at: newAt,
                    ...(payload && { ...payload }), // Only spread if payload exists
                },
            });
            // 6-1-2. Send combined response back to the frontend
            reply.send({
                success: true,
                data: rawReply.json().data, // Unwrap inner success object
                sideEffects: {
                    cookie: {
                        hasData: true,
                        data: {
                            newBid: { token: bid, maxAge: exp.rt.cookieMaxAge }, // Only update maxAge.
                            newAt: { token: newAt, maxAge: exp.at.cookieMaxAge },
                        },
                    },
                    devNotes: [overview, ...(rawReply.json().sideEffects.devNote ? rawReply.json().sideEffects.devNote : [])],
                },
            });
        }
        // 6-2. If no internal route is provided, only return the new tokens inside `sideEffects` property.
        reply.send({
            success: true,
            data: null,
            sideEffects: {
                cookie: {
                    hasData: true,
                    data: {
                        newBid: { token: bid, maxAge: exp.rt.cookieMaxAge }, // Only update maxAge. The value stays the same.
                        newAt: { token: newAt, maxAge: exp.at.cookieMaxAge },
                    },
                    devNotes: { overview },
                },
            },
        });
    };
};
