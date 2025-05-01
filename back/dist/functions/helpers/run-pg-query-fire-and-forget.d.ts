import { FastifyInstance } from "fastify";
/**
 * This helper is designed for queries that do not return data.
 * Useful for table modifications such as INSERT, UPDATE, DELETE, ALTER TABLE, and TRUNCATE.
 *
 * Use `runPgModify` instead if you need to check for existence or verify affected row count.
 *
 * @returns void
 */
export declare const runPgQueryFireAndForget: (fastify: FastifyInstance, query: string, values: any[] | undefined, userIdentifier?: string | number) => Promise<void>;
