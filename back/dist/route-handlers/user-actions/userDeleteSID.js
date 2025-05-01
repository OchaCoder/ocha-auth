import { Type } from "@sinclair/typebox";
import { ValidatorDecodedRT, ValidatorDecodedRTSub } from "../../validators.js";
import { V4 } from "paseto";
import { config } from "../../config.js";
export const UserDeletePayloadSchema = Type.String();
const validateRT = (rt) => {
    // 1: Check for presence
    if (!rt)
        throw new Error("ERR_RT_NOT_FOUND_IN_REDIS"); // AppError("ERR_RT_NOT_FOUND_IN_REDIS", { reason: "Session expired?" })
    // 2: Validate type
    else if (!(typeof rt === "string"))
        throw new Error("ERR_INVALID_RT_TYPE");
    // 3: Validate Paseto Format (v4)
    else if (!rt.startsWith("v4.public."))
        throw new Error("ERR_MALFORMED_RT_DETECTED");
    return rt;
};
const validateDecodedRt = (decodedRt) => {
    // 1: Validate top-level refresh token structure
    if (!ValidatorDecodedRT.Check(decodedRt))
        throw new Error("ERR_INVALID_RT_STRUCTURE");
    // 2: Attemp to parse 'sub'
    let parsedSub;
    try {
        parsedSub = JSON.parse(decodedRt.sub);
    }
    catch {
        throw new Error("ERR_MALFORMED_RT_SUB");
    }
    // 3: Validate parsed 'sub'
    if (!ValidatorDecodedRTSub.Check(parsedSub))
        throw new Error("ERR_INVALID_RT_SUB_STRUCTURE");
    // 4: Return easy to use object
    return { ...decodedRt, parsedSub };
};
export const userDeleteSID = (fastify) => {
    return async (request, reply) => {
        // 1: Extract the sessionID
        const sessionID = request.body;
        if (typeof sessionID !== "string")
            throw new Error("ERR_INVALID_RT_TYPE");
        // 2: Get RT from Redis using sessioinID
        const { redis } = fastify;
        const redisData = await redis.get(`RT:${sessionID}`);
        const rt = validateRT(redisData);
        // 3: Decode RT and get id, name
        const obj = await V4.verify(rt, config.pasetoKeys.public.rt);
        const legitRTObj = validateDecodedRt(obj);
        const userId = legitRTObj.parsedSub.id;
        // 4: Delete the user from the Database
        let client;
        try {
            // 4-1: Create client to connect to the database
            client = await fastify.pg.connect();
            // 4-2: Check if user's email already exists in the database
            const result = await client.query(`DELETE FROM users WHERE id=$1`, [userId]);
            if (result.rowCount === 0)
                throw new Error("ERR_NOTHING_WAS_DELETED"); // The data is already gone!
            // 4-3: Send the success message
            reply.code(200).send({ result: "Success" });
        }
        catch (err) {
            throw err;
        }
        finally {
            if (client)
                client.release();
        }
    };
};
