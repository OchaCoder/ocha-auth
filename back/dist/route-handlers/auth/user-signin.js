import argon2 from "argon2";
import { V4 } from "paseto";
import { nanoid } from "nanoid";
import { config } from "../../config.js";
import { generateStaggeredExpiration } from "../../functions/generators/generate-staggered-expiration.js";
import { PgDataUserSignInValidator as Validator } from "../../validators.js";
import { runRedis } from "../../functions/helpers/run-redis/index.js";
import { runPg } from "../../functions/helpers/run-pg/index.js";
import { resolveUserIdFromBrowserId } from "../../functions/resolvers/resolve-user-id-from-browser-id.js";
import { Type } from "@sinclair/typebox";
// Request body @userSignin
export const UserSignInPayloadSchema = Type.Object({
    payload: Type.Object({
        hasData: Type.Literal(true),
        data: Type.Object({
            email: Type.String(),
            password: Type.String(),
            bid: Type.Optional(Type.String()),
        }),
    }),
});
export const userSignin = (fastify) => {
    return async (request, reply) => {
        const { email, password, bid } = request.body.payload.data;
        // 1. Get user based on email.
        const query = `SELECT id, name, email, hashed_password FROM users WHERE email=$1 LIMIT 1`;
        const validatedData = await runPg.query.obj(fastify, query, [email], email, Validator);
        console.log("email", email, "password", password, validatedData);
        // 2. User is not in the system if null.
        // 👉Future Idea: Insert monitoring point (Prometheus/Grafana) for login failures.
        if (validatedData === null)
            return reply.status(403).send({ success: false, code: "ERR_UNREGISTERED_SIGNIN_REQUEST" });
        // 3. Check the password
        const isPasswordMatching = await argon2.verify(validatedData.hashed_password, password);
        // 👉Future Idea: Insert monitoring point (Prometheus/Grafana) for login failures.
        if (!isPasswordMatching)
            return reply.status(403).send({ success: false, code: "ERR_PASSWORD_NOT_MATCHING" });
        // 4. Geneate expirations for Redis, Paseto and Cookie
        const exp = generateStaggeredExpiration();
        // 5. Generate RT/AT
        const newAt = await V4.sign({ sub: JSON.stringify({ id: validatedData.id }) }, config.pasetoKeys.secret.at, { expiresIn: exp.at.pasetoExpiresIn });
        const newRt = await V4.sign({ sub: JSON.stringify({ id: validatedData.id }) }, config.pasetoKeys.secret.rt, { expiresIn: exp.rt.pasetoExpiresIn });
        // 6. If `bid` is present, the user is either trying to-
        // 6-1. sign into the same account while signed in => Keep the same browserID in the cookie
        // 6-2. switch account without sign out => Sign out & update cookie with new browserID
        // browserID is present in the cookie.
        if (typeof bid === "string" && bid !== "") {
            const userIdFromRt = await resolveUserIdFromBrowserId(fastify, reply, bid);
            // 6-1. The user is signing into the same account.
            if (userIdFromRt === validatedData.id) {
                // Keep the current bid in Redis, but only update TTL.
                await runRedis.fireAndForget(fastify, async () => await fastify.redis.set(`browserID:${bid}`, newRt, "EX", exp.rt.redisSetEX), validatedData.id);
                return reply.code(200).send({
                    success: true,
                    data: {
                        userName: validatedData.name,
                    },
                    sideEffects: {
                        cookie: {
                            hasData: true,
                            data: {
                                newAt: { token: newAt, maxAge: exp.at.cookieMaxAge },
                                newBid: { token: bid, maxAge: exp.rt.cookieMaxAge }, // Same bid, but only update the expiration.
                            },
                        },
                        devNotes: ["sign in operation"],
                    },
                });
            }
            // 6-2. The user is switching accounts without logging out.
            // (The user from email look up, and the user from bid/rt didn't match.)
            // userID from bid/rt => Current account to be signed out.
            // userID from email => New account to be switched.
            //
            // 👉Future idea: Trace account switching pattern to detect fraud/hijack
            //
            // logAccountSwitch({
            //   previousUserId: userIdFromRt,
            //   newUserId: validatedData.id,
            //   bid,
            //   timestamp: Date.now(),
            // })
            else {
                // Sign this user out from the current account
                await runRedis.fireAndForget(fastify, async () => {
                    await fastify.redis.del(`browserID:${bid}`); // Remove one `rt` from Redis, using corresponding `bid`.
                    await fastify.redis.zrem(`user:${userIdFromRt}:browsers`, bid); // Remove one `bid` from Redis Set storing all `bid` of this user.
                }, validatedData.id);
            }
        }
        // 7. No `bid` in the cookie. This is a fresh sign in.
        const newBid = nanoid();
        await runRedis.fireAndForget(fastify, async () => {
            // 8. Save the new rt using bid as the key. TTL is in seconds (EX).
            await fastify.redis.set(`browserID:${newBid}`, newRt, "EX", exp.rt.redisSetEX);
            // 9. Add this bid to the Redis Set.
            // 9-1. If the cap of 10 browsers per user is hit, remove the oldest browserID.
            const length = await fastify.redis.zcard(`user:${validatedData.id}:browsers:`);
            if (length >= 10)
                await fastify.redis.zpopmin(`user:${validatedData.id}:browsers:`);
            // 9-2. Create score from the current timestamp
            const score = Date.now();
            // 9-3. Add browserID and score to Ordered Set
            await fastify.redis.zadd(`user:${validatedData.id}:browsers`, score, newBid);
        }, validatedData.id);
        // 10. Send reply
        return reply.code(200).send({
            success: true,
            data: { userName: validatedData.name },
            sideEffects: {
                cookie: {
                    hasData: true,
                    data: {
                        newAt: { token: newAt, maxAge: exp.at.cookieMaxAge },
                        newBid: { token: newBid, maxAge: exp.rt.cookieMaxAge },
                    },
                },
                devNotes: ["General action - User is signing in."],
            },
        });
    };
};
