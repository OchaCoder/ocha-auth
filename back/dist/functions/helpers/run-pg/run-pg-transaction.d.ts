import { StaticDecode, TObject } from "@sinclair/typebox";
import { TypeCheck } from "@sinclair/typebox/compiler";
import { FastifyInstance } from "fastify";
import { PoolClient } from "pg";
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
export declare const runPgTransaction: <T extends TObject>(fastify: FastifyInstance, callback: (client: PoolClient) => Promise<{
    rows: unknown[];
}>, userIdentifier: string | number | undefined, validator: TypeCheck<T>) => Promise<StaticDecode<T, []> | null>;
