import { FastifyInstance } from "fastify";
/**
 * Runs a lightweight PostgreSQL query to check whether a row exists.
 * Designed for simple SELECT 1 ... LIMIT 1 checks.
 *
 * @returns true if data exists, false otherwise
 */
export declare const runPgExists: (fastify: FastifyInstance, query: string, values: any[] | undefined, userIdentifier: string | number) => Promise<boolean>;
