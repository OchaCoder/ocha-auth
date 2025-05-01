import { ErrorPostgres } from "../../error-classes/error-pg.js";
import { errLogPgUserRequestNotFulfilled } from "../loggers/log-pg-errors.js";
import { ErrorDefensiveGuardBreach } from "../../error-classes/error-defensive-guard-breach.js";
/**
 * This helper is designed for queries that return a single row of data,
 * such as SELECT queries or modification queries with a `RETURNING` clause.
 *
 * It validates the returned row against a provided TypeBox schema.
 *
 * @returns The decoded and validated row.
 *
 * Use this when you expect exactly one result row and want strict schema validation.
 * For multi-row results, consider using a different helper.
 */
export const runPgQueryExpecting = async (fastify, query, values, userIdentifier = "", validator) => {
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
    // Defensive guard — this should never trigger if the query is written correctly.
    // If it does, it's likely due to a broken query or a missing RETURNING clause.
    if (!(rawData.rows[0] ?? null))
        throw new ErrorDefensiveGuardBreach("ERR_BAD_PG_QUERY", `rawData.rows[0] is empty. Check the query string: ${query}`);
    // Defensive guard — this should never trigger if both the query and the TypeBox schema are correctly configured.
    // Helps catch mismatches if the schema or query changes in the future.
    if (!validator.Check(rawData.rows[0]))
        throw new ErrorDefensiveGuardBreach("ERR_BAD_PG_QUERY_OR_SCHEMA", `rawData.rows[0] does not match the expected schema. Check the query string: ${query} and the TypeBox schema.`);
    // Always return the validated and decoded data.
    return validator.Decode(rawData.rows[0]);
};
