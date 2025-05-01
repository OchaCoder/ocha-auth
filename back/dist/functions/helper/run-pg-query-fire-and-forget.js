import { ErrorPostgres } from "../../error-classes/error-pg.js";
import { errLogPgUserRequestNotFulfilled } from "../loggers/log-pg-errors.js";
/**
 * This helper is designed for queries that do not return data.
 * Useful for table modifications such as INSERT, UPDATE, DELETE, ALTER TABLE, and TRUNCATE.
 *
 * Use `runPgModify` instead if you need to check for existence or verify affected row count.
 *
 * @returns void
 */
export const runPgQueryFireAndForget = async (fastify, query, values, userIdentifier = "") => {
    const requestSentAt = Date.now();
    let client;
    let rawData;
    try {
        client = await fastify.pg.connect();
        rawData = await client.query(query, values);
    }
    catch (err) {
        // Only catch errors thrown by PostgreSQL itself.
        // This usually indicates a connection issue or server failure.
        const requestTimeoutAt = Date.now();
        const userWait = requestTimeoutAt - requestSentAt;
        errLogPgUserRequestNotFulfilled(fastify, userIdentifier, userWait);
        // Immediately start the special health check.
        if (fastify.postgresAvailable)
            fastify.healthPostgres("SPECIAL");
        throw new ErrorPostgres(err, "ERR_PG_DOWN"); // Rename the error to ErrorPostgres and rethrow.
    }
    finally {
        if (client)
            client.release();
    }
};
