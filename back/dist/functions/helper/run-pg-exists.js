import { errLogPgUserRequestNotFulfilled } from "../loggers/log-pg-errors.js";
import { ErrorPostgres } from "../../error-classes/error-pg.js";
/**
 * Runs a lightweight PostgreSQL query to check whether a row exists.
 * Designed for simple SELECT 1 ... LIMIT 1 checks.
 *
 * @returns true if data exists, false otherwise
 */
export const runPgExists = async (fastify, query, values, userIdentifier) => {
    const requestSentAt = Date.now();
    let client;
    let rawData;
    try {
        client = await fastify.pg.connect();
        // Execute the query.
        rawData = await client.query(query, values);
    }
    catch (err) {
        // Only catch errors related to PostgreSQL operations.
        // Calculate how long the user waited before the failure occurred.
        const requestTimeoutAt = Date.now();
        const userWait = requestTimeoutAt - requestSentAt;
        // Log that the user's request could not be fulfilled due to a PostgreSQL failure.
        errLogPgUserRequestNotFulfilled(fastify, userIdentifier, userWait);
        // Trigger the special PostgreSQL health check logic.
        if (fastify.postgresAvailable)
            fastify.healthPostgres("SPECIAL");
        // Wrap and re-throw the original error as a structured Postgres error.
        throw new ErrorPostgres({ originalErr: err });
    }
    finally {
        // Always release the client to prevent connection leaks.
        if (client)
            client.release();
    }
    // Target data existed in the table.
    if (rawData.rows.length > 0)
        return true;
    // Targte data did not exist.
    else
        return false;
};
