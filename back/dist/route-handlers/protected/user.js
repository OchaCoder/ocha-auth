import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import argon2 from "argon2";
import { V4 } from "paseto";
import { nanoid } from "nanoid";
import { config } from "../../config.js";
import { generateStaggeredExpiration } from "../../functions/generators/generateStaggeredExpiration.js";
// Define Schema for this route
export const UserSignInPayloadSchema = Type.Object({
    email: Type.String(),
    password: Type.String(),
});
// Define Schema for Database reply
export const UserObjSchema = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    email: Type.String(),
    hashed_password: Type.String(),
    last_modified_at: Type.Date(),
});
// Compile the schema for speed
const UserObjValidator = TypeCompiler.Compile(UserObjSchema);
export const userDashboard = (fastify) => {
    return async (request, reply) => {
        console.log("REQUEST", request.body);
        const { email, password } = request.body;
        let client;
        try {
            // 1: Create client to connect
            client = await fastify.pg.connect();
            // 2: Search user based on email.
            const query = `SELECT id, name, email, hashed_password, last_modified_at FROM users WHERE email=$1 LIMIT 1`;
            const data = await client.query(query, [email]);
            // 3: Validate the returned object
            const userObj = data.rows[0] ?? null; // Defaults to null if undefined or null
            if (!userObj)
                throw new Error("ERR_NO_USER_RETURNED");
            if (!UserObjValidator.Check(userObj))
                throw new Error("ERR_INVALID_DB_REPONSE");
            // 4: Check the password
            const isPasswordMatching = await argon2.verify(userObj.hashed_password, password);
            if (!isPasswordMatching)
                throw new Error("ERR_WRONG_PASSWORD"); //  Password did not match.
            // 5: Geneate expirations for Redis, Paseto and Cookie
            const exp = generateStaggeredExpiration();
            // 6: Generate RT/AT
            const at = await V4.sign({ sub: JSON.stringify({ id: userObj.id }) }, config.pasetoKeys.secret.at, { expiresIn: exp.at.pasetoExpiresIn });
            const rt = await V4.sign({ sub: JSON.stringify({ id: userObj.id, name: userObj.name }) }, config.pasetoKeys.secret.rt, { expiresIn: exp.rt.pasetoExpiresIn });
            // 7: Generate sessionID
            const sessionID = nanoid();
            // 8: Save RT to Redis using sessionID as key
            const { redis } = fastify;
            redis.set(`RT:${sessionID}`, rt, "EX", exp.rt.redisSetEX);
            // 9:Send reply
            reply.code(200).send({
                userData: { name: userObj.name, email: userObj.email, lastModifiedAt: userObj.last_modified_at, at: at },
                cookie: {
                    sessionID: { id: sessionID, maxAge: exp.rt.cookieMaxAge },
                    fastPassTicket: { id: config.fastPassTicket, maxAge: 60 * 60 * 24 * 180 },
                },
            });
        }
        catch (err) {
            throw err; // Always re-throw the original error
        }
        finally {
            if (client)
                client.release();
        }
    };
};
