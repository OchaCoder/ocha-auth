import { FastifyInstance } from "fastify"
import { runPgBooleanCheck } from "./runPgBooleanCheck.js"

/**
 * Runs a lightweight PostgreSQL query to check whether a row exists.
 * Designed for simple SELECT 1 ... LIMIT 1 checks.
 *
 * @returns true if the query found a matching row, or false if nothing matched.
 *
 *Internally uses `runPgBooleanCheck`.
 *
 */

export const runPgExists = async (
  fastify: FastifyInstance,
  query: string,
  values: any[] | undefined,
  userIdentifier: string | number
  //
) => runPgBooleanCheck(fastify, query, values, userIdentifier, (r) => r.rows.length > 0)
