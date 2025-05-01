import { errLogPgUserRequestNotFulfilled } from "../../loggers/log-pg-errors.js";
import { ErrorPostgres } from "../../../error-classes/error-pg.js";
import { ErrorDefensiveGuardBreach } from "../../../error-classes/error-defensive-guard-breach.js";
/**
 * `runPgTransaction` is part of the `runPg` helper series,
 * which standardizes how Postgres operations are executed and how failures are handled.
 *
 * This helper wraps a transaction around user-defined Postgres logic.
 *
 * It opens a connection, begins a transaction, passes a live `client` to the callback,
 * and automatically commits or rolls back depending on the result.
 *
 * Use this helper when:
 * - You need to run multiple Postgres queries in a single atomic transaction
 * - You want automatic rollback on any thrown error
 * - You want centralized health-check handling on Postgres failure
 * - You expect to return *exactly one row*
 * - That row should be validated against a TypeBox schema
 *
 * ⚠️ DANGER ZONE:
 * This helper is only as safe as the callback you provide.
 *
 * - If your callback throws an error unrelated to Postgres (e.g., logic bug, validation, etc.),
 *   it will still trigger the Postgres health-check.
 *
 * - If your callback forgets to return the result of a query,
 *   schema validation will fail or `undefined` will be returned.
 *
 * Think of this helper as a JS-style `unsafe` block:
 *   It helps you concentrate error handling and connection logic,
 *   but you must use it responsibly and return exactly what is expected.
 *
 * @param fastify - Fastify instance with `.pg` plugin attached
 * @param callback - Your async transactional logic using a `PoolClient`
 * @param userIdentifier - Used for logging wait-time on failure (can be user ID or context string)
 * @param validator - TypeBox schema used to validate the returned row
 *
 * @returns The validated and decoded row if one is returned, or `null` if no row was found
 */
export const runPgTransaction = async (fastify, callback, userIdentifier = "", validator) => {
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
        throw new ErrorPostgres(err);
    }
    finally {
        if (client)
            client.release();
    }
    // Defensive guard — This is about callback misconfiguratioin than postgres error.
    // for this guard to trigger, the callback has to
    // 1. return; (implicitly undefined)
    // 2. Forget to await the query
    // 3. Not return the result of client.query(...)
    // 4. Or just return nothing at all
    if (rawData === undefined)
        throw new ErrorDefensiveGuardBreach("ERR_BAD_PG_CALLBACK", "Callback returned undefined. Make sure to return the query result.");
    // This is "0 rows returned" case.and mostly means
    // 'could not find what was asked', and is a valid expected behavior in many case.
    if (!rawData || !Array.isArray(rawData.rows) || !rawData.rows[0])
        return null;
    // Defensive guard — schema mismatch
    if (!validator.Check(rawData.rows[0]))
        throw new ErrorDefensiveGuardBreach(`ERR_BAD_PG_QUERY_OR_SCHEMA`, `Returned data does not match the expected schema. Check your TypeBox schema and SQL.`);
    return validator.Decode(rawData.rows[0]);
};
