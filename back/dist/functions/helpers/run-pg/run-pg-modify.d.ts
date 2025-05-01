import { FastifyInstance } from "fastify";
/**
 * This helper is designed to simplify table modification actions
 * that do not involve `RETURNING`, such as:
 * INSERT, UPDATE, DELETE, ALTER TABLE, and TRUNCATE.
 *
 * For modification queries that include a `RETURNING` clause,
 * use `runPgQueryObjUrNull` or `runPgTransactionObjOrNull` instead.
 *
 * It uses `rowCount` to determine whether the operation was successful.
 *
 * @returns true if at least one row was affected, or false if no changes were made.
 *
 * Internally uses `runPgBooleanCheck`.
 *
 */
export declare const runPgModify: (fastify: FastifyInstance, query: string, values: any[] | undefined, userIdentifier?: string | number) => Promise<boolean>;
