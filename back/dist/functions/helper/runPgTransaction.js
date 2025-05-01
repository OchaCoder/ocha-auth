import { errLogPgUserRequestNotFulfilled } from "../../plugins/node-pg/pgErrorLogHandler.js";
import { ErrorPostgres } from "../../error-classes/error-pg.js";
export const runPgTransaction = async (fastify, callback, userIdentifier, validator) => {
    const requestSentAt = Date.now();
    let client;
    let rawData;
    try {
        client = await fastify.pg.connect();
        await client.query(`BEGIN`);
        rawData = await callback(client);
        await client.query(`COMMIT`);
    }
    catch (err) {
        const requestTimeoutAt = Date.now();
        const userWait = requestTimeoutAt - requestSentAt;
        errLogPgUserRequestNotFulfilled(fastify, userIdentifier, userWait);
        if (fastify.postgresAvailable)
            fastify.healthPostgres("SPECIAL");
        throw new ErrorPostgres({ originalErr: err });
    }
    finally {
        if (client)
            client.release();
    }
    // Skip all validation if no validator provided
    if (!validator)
        return null;
    if (!(rawData.rows[0] ?? null))
        throw new Error("ERR_NO_DATA_RETURNED");
    if (!validator.Check(rawData.rows[0]))
        throw new Error("TypeBox validation failed");
    return validator.Decode(rawData.rows[0]);
};
