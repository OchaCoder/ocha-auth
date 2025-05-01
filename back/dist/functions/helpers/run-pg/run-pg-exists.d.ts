import { FastifyInstance } from "fastify";
/**
 * Runs a lightweight PostgreSQL query to check whether a row exists.
 * Designed for simple SELECT 1 ... LIMIT 1 checks.
 *
 * @returns true if the query found a matching row, or false if nothing matched.
 *
 *Internally uses `runPgBooleanCheck`.
 *
 */
export declare const runPgExists: (fastify: FastifyInstance, query: string, values: any[] | undefined, userIdentifier: string | number) => Promise<boolean>;
