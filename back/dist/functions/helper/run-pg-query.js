import { ErrorPostgres } from "../../error-classes/error-pg.js";
import { errLogPgUserRequestNotFulfilled } from "../loggers/log-pg-errors.js";
/**
 * This helper is designed for queries that return a single row of data,
 * including SELECT queries or modification queries with a `RETURNING` clause.
 *
 * It optionally validates the returned row using a TypeBox schema.
 *
 * @returns the decoded and validated row, or null if no row was returned or validation was skipped.
 *
 * Use this helper when you expect a single result row and may want to perform schema validation.
 * For multi-row results, consider a specialized helper.
 */
export const runPgQuery = async (fastify, query, values, userIdentifier, validator) => {
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
        // Immediately start the special health check.
        if (fastify.postgresAvailable)
            fastify.healthPostgres("SPECIAL");
        throw new ErrorPostgres({ originalErr: err }); // Rename the error to ErrorPostgres and rethrow.
    }
    finally {
        if (client)
            client.release();
    }
    // Skip all validation if no validator provided
    if (!validator)
        return null;
    if (!(rawData.rows[0] ?? null))
        return null;
    if (!validator.Check(rawData.rows[0]))
        throw new Error("ERR_TYPEBOX_VALIDATION_FAILED");
    const validated = rawData.rows[0];
    return validated; // Wasn't this the right thing to return???🧐💦
    //return validator.Decode(rawData.rows[0]) as Static<T>
};
