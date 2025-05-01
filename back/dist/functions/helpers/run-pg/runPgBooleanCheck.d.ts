import { FastifyInstance } from "fastify";
/**
 * Internal utility helper used to abstract any PostgreSQL query
 * that returns a boolean based on the query result.
 *
 * Use this inside other helpers when:
 * - You want to encapsulate connection, error handling, and health-check logic
 * - You only care about a boolean result (e.g., row existence or mutation success)
 *
 * The `checker` function receives a normalized query result
 * and should return `true` or `false` based on your custom condition.
 *
 * @returns A boolean based on the provided `checker` function
 */
export declare const runPgBooleanCheck: (fastify: FastifyInstance, query: string, values: any[] | undefined, userIdentifier: string | number | undefined, checker: (result: {
    rowCount: number;
    rows: unknown[];
}) => boolean) => Promise<boolean>;
