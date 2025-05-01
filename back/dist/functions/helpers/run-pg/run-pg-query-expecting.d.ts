import { FastifyInstance } from "fastify";
import { TypeCheck } from "@sinclair/typebox/compiler";
import { StaticDecode, TObject } from "@sinclair/typebox";
/**
 * `runPgQueryObjOrNull` is part of the `runPg` helper series,
 * which standardizes how Postgres queries are executed and how failures are handled.
 *
 * This helper executes a single Postgres query and:
 * - Expects **zero or one row** in return
 * - Validates that row against a provided TypeBox schema
 *
 * It is useful for:
 * - SELECT queries that return at most one result
 * - INSERT/UPDATE queries with a `RETURNING` clause
 *
 * If no row is found, it returns `null` — allowing the caller to handle absence explicitly.
 * If a row is found but fails schema validation, an error is thrown.
 *
 * Use this helper when:
 * - You expect at most one result row
 * - That row must match a strict schema
 * - You want automatic logging and Postgres health-checks on failure
 *
 * @returns The validated object, or `null` if no match was found
 */
export declare const runPgQueryObjOrNull: <T extends TObject>(fastify: FastifyInstance, query: string, values: any[] | undefined, userIdentifier: string | number | undefined, validator: TypeCheck<T>) => Promise<StaticDecode<T, []> | null>;
