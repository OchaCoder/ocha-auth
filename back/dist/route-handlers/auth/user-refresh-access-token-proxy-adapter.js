import { V4 } from "paseto";
import { config } from "../../config.js";
import { generateStaggeredExpiration } from "../../functions/generators/generate-staggered-expiration.js";
import { runRedis } from "../../functions/helpers/run-redis/index.js";
import { resolveUserIdFromBrowserId } from "../../functions/resolvers/resolve-user-id-from-browser-id.js";
import { Type } from "@sinclair/typebox";
// Expected shape of the request body for this route
export const UserRefreshAccessTokenProxyAdapterSchema = Type.Object({
    bid: Type.String(),
    proxyPath: Type.String(),
    payload: Type.Object({
        hasData: Type.Boolean(),
        data: Type.Any(),
    }),
});
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
/**
 * This glue route acts as both a proxy and an adapter:
 *
 * - It forwards the payload to the specified internal route (`proxyPath`) — proxy behavior.
 * - It reshapes the final response by unwrapping the nested success object and attaching new token cookies — adapter behavior.
 *
 * Its purpose is to reduce frontend round trips by handling token refresh and request forwarding in a single operation.
 *
 * This proxy/adapter is used for both static content loading (e.g. Qwik's `routeLoader$`),
 * and operative actions that optionally require input payload (e.g. Qwik's `routeAction$` or `globalAction$`).
 *
 * One might point out that some destination routes — such as `user-delete` — may not need a payload at all.
 *
 * However, to favor an explicit and consistent design, this route **always** expects a `payload` to be present,
 * regardless of what the internal route at `proxyPath` does.
 *
 * Throughout this app, any `payload` in the request body is expected to follow this unified structure:
 *
 * `{ hasData: boolean; data: any | null; }`
 */
export const userRefreshAccessTokenProxyAdapter = (fastify) => {
    return async (request, reply) => {
        // 1. Extract the browser ID (`bid`), the internal destination path (`proxyPath`), and the payload.
        const { bid, proxyPath, payload } = request.body; // Guaranteed to exist
        // 2. ⚠️ User authentication logic begins here
        // Resolve user ID by validating and parsing the refresh token (`rt`) from Redis using `bid`.
        const userId = await resolveUserIdFromBrowserId(fastify, reply, bid);
        // 3. Generate staggered expiration values for Paseto, Redis, and cookies
        const exp = generateStaggeredExpiration();
        // 4. Sign new AT and RT using the user's ID
        const newAt = await V4.sign({ sub: JSON.stringify({ id: userId }) }, config.pasetoKeys.secret.at, { expiresIn: exp.at.pasetoExpiresIn });
        const newRt = await V4.sign({ sub: JSON.stringify({ id: userId }) }, config.pasetoKeys.secret.rt, { expiresIn: exp.rt.pasetoExpiresIn });
        // 5. Replace the old refresh token in Redis with the new one, under the same browser ID
        await runRedis.fireAndForget(fastify, async () => await fastify.redis.set(`browserID:${bid}`, newRt, "EX", exp.rt.redisSetEX), userId);
        // 6. [Proxy] Forward the request to the specified internal route (`proxyPath`) with the refreshed access token
        const rawReply = await fastify.inject({
            method: "POST",
            url: proxyPath,
            payload: {
                at: newAt,
                payload: payload, // Include regardless of whether it contains data
            },
        });
        // 7. [Adapter] Reshape the returned response and send it back to the frontend
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
                devNotes: [overview, ...(rawReply.json().sideEffects?.devNotes ? rawReply.json().sideEffects.devNotes : "")],
            },
        });
    };
};
