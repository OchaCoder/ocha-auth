import { FastifyInstance } from "fastify";
import { TypeCheck } from "@sinclair/typebox/compiler";
import { Static, TObject } from "@sinclair/typebox";
/**
 * This helper is designed for queries that return a single row of data,
 * such as SELECT queries or modification queries with a `RETURNING` clause.
 *
 * It validates the returned row against a provided TypeBox schema.
 *
 * @returns The decoded and validated row.
 *
 * Use this when you expect exactly one result row and want strict schema validation.
 * For multi-row results, consider using a different helper.
 */
export declare const runPgQueryExpecting: <T extends TObject>(fastify: FastifyInstance, query: string, values: any[] | undefined, userIdentifier: string | number | undefined, validator: TypeCheck<T>) => Promise<Static<T>>;
