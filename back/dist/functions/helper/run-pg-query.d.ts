import { FastifyInstance } from "fastify";
import { TypeCheck } from "@sinclair/typebox/compiler";
import { Static, TObject } from "@sinclair/typebox";
/**
 * This helper is designed for queries that return a single row of data,
 * including SELECT queries or modification queries with a `RETURNING` clause.
 *
 * It optionally validates the returned row using a TypeBox schema.
 *
 * @returns the decoded and validated row, or null if no row was returned or validation was skipped.
 *
 * Use this helper when you expect a single result row and may want to perform schema validation.
 * For multi-row results, consider a specialized helper.
 */
export declare const runPgQuery: <T extends TObject>(fastify: FastifyInstance, query: string, values: any[] | undefined, userIdentifier: string | number, validator: TypeCheck<T> | undefined) => Promise<Static<T> | null>;
