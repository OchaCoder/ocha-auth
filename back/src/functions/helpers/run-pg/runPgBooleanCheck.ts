import { FastifyInstance } from "fastify"
import { PoolClient } from "pg"
import { errLogPgUserRequestNotFulfilled } from "../../loggers/log-pg-errors.js"
import { ErrorPostgres } from "../../../error-classes/error-pg.js"

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

export const runPgBooleanCheck = async (
  fastify: FastifyInstance,
  query: string,
  values: any[] | undefined,
  userIdentifier: string | number = "",
  checker: (result: { rowCount: number; rows: unknown[] }) => boolean
): Promise<boolean> => {
  const requestSentAt = Date.now()

  let client: PoolClient | undefined
  let safeResult: { rowCount: number; rows: unknown[] }

  try {
    client = await fastify.pg.connect()

    // Execute the query.
    const rawData = await client.query(query, values)

    // Defensive normalization: ensure rowCount is a number (pg types it as number | null)
    safeResult = {
      rowCount: rawData.rowCount ?? 0,
      rows: rawData.rows,
    }
  } catch (err) {
    // Only catch errors related to PostgreSQL operations.

    // Calculate how long the user waited before the operation failed.
    const requestTimeoutAt = Date.now()
    const userWait = requestTimeoutAt - requestSentAt

    // Log that the user's request could not be fulfilled due to a PostgreSQL failure.
    errLogPgUserRequestNotFulfilled(fastify, userIdentifier, userWait)

    // Trigger the special PostgreSQL health check logic.
    if (fastify.postgresAvailable) fastify.healthPostgres("SPECIAL")

    // Wrap and re-throw the original error as a structured Postgres error.
    throw new ErrorPostgres(err, "ERR_PG_DOWN")
  } finally {
    // Always release the client to prevent connection leaks.
    if (client) client.release()
  }

  return checker(safeResult)
}
