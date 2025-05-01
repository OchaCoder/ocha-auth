import { errLogPgUserRequestNotFulfilled } from "../loggers/log-pg-errors.js";
import { ErrorPostgres } from "../../error-classes/error-pg.js";
/**
 * This helper is designed to simplify table modification actions
 * that do not involve `RETURNING`, such as:
 * INSERT, UPDATE, DELETE, ALTER TABLE, and TRUNCATE.
 *
 * For modification queries that include a `RETURNING` clause,
 * use `runPgQuery` or `runPgTransaction` instead.
 *
 * It uses `rowCount` to determine whether the operation was successful.
 *
 * @returns false if no rows were affected, or true if at least one row was modified.
 */
export const runPgModify = async (fastify, query, values, userIdentifier) => {
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
        // Calculate how long the user waited before the operation failed.
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
    // No rows were affected by the query.
    if (rawData.rowCount === 0)
        return false;
    // Operation affected at least one row.
    return true;
};
