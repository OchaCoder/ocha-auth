import { FastifyInstance } from "fastify";
/**
 * `runPgQueryFireAndForget` is part of the `runPg` helper series,
 * which standardizes how Postgres commands are executed and how failures are handled.
 *
 * This helper runs a single SQL query where no return value is needed.
 * It is ideal for commands executed for their side effect, such as:
 * - INSERT
 * - UPDATE
 * - DELETE
 * - ALTER TABLE
 * - TRUNCATE
 *
 * Use `runPgModify()` instead if you need to check `rowCount` to confirm success.
 *
 * This helper intentionally discards the query result.
 *
 * @returns void
 */
export declare const runPgQueryFireAndForget: (fastify: FastifyInstance, query: string, values: any[] | undefined, userIdentifier?: string | number) => Promise<void>;
