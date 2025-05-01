import { FastifyInstance } from "fastify";
import { PoolClient } from "pg";
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
export declare const runPgTransactionFireAndForget: (fastify: FastifyInstance, callback: (client: PoolClient) => Promise<{
    rows: unknown[];
}>, userIdentifier?: string | number) => Promise<void>;
