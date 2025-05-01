import { errLogPgUserRequestNotFulfilled } from "../../loggers/log-pg-errors.js";
import { ErrorPostgres } from "../../../error-classes/error-pg.js";
/**
 * ⚠️ WARNING: Misuse of the callback will falsely trigger a Postgres health check.
 *
 * This helper will treat *any* thrown error — even if unrelated to Postgres —
 * as a sign of Postgres failure. Use caution when inserting validation or other logic.
 *
 * `runPgTransactionFireAndForget` is part of the `runPg` helper series,
 * which standardizes how Postgres commands are executed and how failures are handled.
 *
 * This version runs a Postgres transaction for its side effects only —
 * it does not return or validate data.
 *
 * It opens a connection, begins a transaction, passes a live `client` to the callback,
 * and automatically commits or rolls back based on whether the callback throws.
 *
 * Use this helper when:
 * - You want to run multiple queries in a single atomic transaction
 * - You want to discard any return value from those queries
 * - You want centralized error logging and health-check triggering
 *
 * Example use cases: DELETE multiple rows, UPDATE many records, INSERT logs, etc.
 *
 * @param fastify - Fastify instance with `.pg` plugin
 * @param callback - Your transactional logic, using a `PoolClient`
 * @param userIdentifier - Used to log affected user/context on connection failure
 *
 * @returns void — result of queries is discarded
 */
export const runPgTransactionFireAndForget = async (fastify, callback, userIdentifier = "") => {
    const requestSentAt = Date.now();
    let client;
    try {
        client = await fastify.pg.connect();
        await client.query(`BEGIN`);
        const _ = await callback(client);
        // ⚠️ Postgres response intentionally discarded — this is fire-and-forget.
        await client.query(`COMMIT`);
    }
    catch (err) {
        const requestTimeoutAt = Date.now();
        const userWait = requestTimeoutAt - requestSentAt;
        errLogPgUserRequestNotFulfilled(fastify, userIdentifier, userWait);
        if (fastify.postgresAvailable)
            fastify.healthPostgres("SPECIAL");
        throw new ErrorPostgres(err, "ERR_PG_DOWN");
    }
    finally {
        if (client)
            client.release();
    }
};
