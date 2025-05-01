import { FastifyInstance } from "fastify";
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
export declare const runPgModify: (fastify: FastifyInstance, query: string, values: any[] | undefined, userIdentifier: string | number) => Promise<boolean>;
