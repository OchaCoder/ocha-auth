import { errLogPgUserRequestNotFulfilled } from "../../plugins/node-pg/pgErrorLogHandler.js";
import { ErrorPostgres } from "../../error-classes/error-pg.js";
export const runPgSExists = async (fastify, query, values, userIdentifier) => {
    const requestSentAt = Date.now();
    let client;
    let rawData;
    try {
        client = await fastify.pg.connect();
        rawData = await client.query(query, values);
    }
    catch (err) {
        // Keep the catch-block only for Error thrown by Postgres.
        const requestTimeoutAt = Date.now();
        const userWait = requestTimeoutAt - requestSentAt;
        errLogPgUserRequestNotFulfilled(fastify, userIdentifier, userWait);
        throw new ErrorPostgres({ originalErr: err });
    }
    finally {
        if (client)
            client.release();
    }
    // Skip all validation if no validator provided
    if (rawData.rows.length > 0)
        return true;
    else
        return false;
};
