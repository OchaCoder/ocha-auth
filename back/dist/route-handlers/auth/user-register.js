import argon2 from "argon2";
import { V4 } from "paseto";
import { nanoid } from "nanoid";
import { config } from "../../config.js";
import { generateStaggeredExpiration } from "../../functions/generators/generate-staggered-expiration.js";
import { PgDataUserIDNameValidator as Validator } from "../../validators.js";
import { runRedis } from "../../functions/helpers/run-redis/index.js";
import { runPg } from "../../functions/helpers/run-pg/index.js";
import { ErrorDefensiveGuardBreach } from "../../error-classes/error-defensive-guard-breach.js";
import { Type } from "@sinclair/typebox";
// Request body @userRegister
export const UserRegisterPayloadSchema = Type.Object({
    payload: Type.Object({ hasData: Type.Literal(true), data: Type.Object({ name: Type.String(), email: Type.String(), password: Type.String() }) }),
});
export const userRegister = (fastify) => {
    return async (request, reply) => {
        const { name, email, password } = request.body.payload.data;
        // 1. Check if user already exists.
        const existsBool = await runPg.bool.exists(fastify, `SELECT 1 FROM users WHERE email=$1 LIMIT 1`, [email], email);
        if (existsBool)
            return reply.status(400).send({ success: false, code: "ERR_EMAIL_ALREADY_EXISTS" });
        // 2. Hash user password.
        const hashedPassword = await argon2.hash(password, config.argon2Config);
        // 3. Insert new user into the database and validate the returned object
        const dynQueryUserInsert = `
              INSERT INTO users(name, email, hashed_password)
              VALUES($1,$2,$3)
              RETURNING id, name
              `;
        const dynValsUserInsert = [name, email, hashedPassword];
        const validatedData = await runPg.query.obj(fastify, dynQueryUserInsert, dynValsUserInsert, email, Validator);
        // Defensive check — This should never happen if the existence check passed.
        // Likely a bug caused by a logic regression or unintended DB behavior.
        if (validatedData === null)
            throw new ErrorDefensiveGuardBreach("ERR_NO_PG_RETURN", "Postgres did not return the inserted user. This should never happen if the exist-check is working. Likely a bug or unexpected DB state.");
        // 5. Generate expiration values for Redis, Paseto, and cookie
        const exp = generateStaggeredExpiration();
        // 6. Create access and refresh tokens using the user ID.
        const newAt = await V4.sign({ sub: JSON.stringify({ id: validatedData.id }) }, config.pasetoKeys.secret.at, { expiresIn: exp.at.pasetoExpiresIn });
        const newRt = await V4.sign({ sub: JSON.stringify({ id: validatedData.id }) }, config.pasetoKeys.secret.rt, { expiresIn: exp.rt.pasetoExpiresIn });
        // 7. Generate browser ID
        const bid = nanoid();
        //`bid` (browser ID) derives from user cookie, and is exclusively used as a key
        // to acquire refresh token (RT) from Redis.
        // (RT is stored in Redis as such: `redis.set(`browserID:${bid}`, rt, "EX", TTL)`)
        // `bid` itself does not expire, because it is a nanoID, but the frontend is encouraged to
        // use a pregenerated TTL on the cookie storing `bid`.
        // This TTL coresponds with the TTL used for Redis shown above, introducing a slight stagger
        // to ensure that the cookie expires slightly before Redis(see `generateStaggeredExpiration `).
        await runRedis.fireAndForget(fastify, async () => {
            // 8. Save RT using browser ID with TTL in seconds.
            await fastify.redis.set(`browserID:${bid}`, newRt, "EX", exp.rt.redisSetEX);
            // 9. Add browser ID to sorted set with timestamp as score.
            // This is necessary to implement `sign out from all device/this device` feature.
            await fastify.redis.zadd(`user:${validatedData.id}:browsers`, Date.now(), bid);
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
                        newBid: { token: bid, maxAge: exp.rt.cookieMaxAge },
                    },
                },
                devNotes: ["General action - User is signing up for a new account."],
            },
        });
    };
};
