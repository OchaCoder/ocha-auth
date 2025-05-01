import { Type } from "@sinclair/typebox";
import { V4 } from "paseto";
import { ValidatorDecodedAT, ValidatorDecodedATSub } from "../../validators.js";
import { config } from "../../config.js";
export const UserDeletePayloadSchema = Type.String();
const validateAT = (at) => {
    // 1: Check for presence
    if (!at)
        throw new Error("ERR_AT_NOT_FOUND"); // AppError("ERR_RT_NOT_FOUND_IN_REDIS", { reason: "Session expired?" })
    // 2: Validate type
    else if (!(typeof at === "string"))
        throw new Error("ERR_INVALID_AT_TYPE");
    // 3: Validate Paseto Format (v4)
    else if (!at.startsWith("v4.public."))
        throw new Error("ERR_MALFORMED_AT_DETECTED");
    return at;
};
const validateDecodedAT = (decodedAT) => {
    // 1: Validate top-level AT structure
    if (!ValidatorDecodedAT.Check(decodedAT))
        throw new Error("ERR_INVALID_AT_STRUCTURE");
    // 2: Attemp to parse 'sub'
    let parsedSub;
    try {
        parsedSub = JSON.parse(decodedAT.sub);
    }
    catch {
        throw new Error("ERR_MALFORMED_AT_SUB");
    }
    // 3: Validate parsed 'sub'
    if (!ValidatorDecodedATSub.Check(parsedSub))
        throw new Error("ERR_INVALID_AT_SUB_STRUCTURE");
    // 4: Return easy to use object
    return { ...decodedAT, parsedSub };
};
export const userDelete = (fastify) => {
    return async (request, reply) => {
        const payload = request.body;
        const at = validateAT(payload);
        // 3: Decode AT and get id, name
        const obj = await V4.verify(at, config.pasetoKeys.public.at);
        const legitATObj = validateDecodedAT(obj);
        const userId = legitATObj.parsedSub.id;
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
