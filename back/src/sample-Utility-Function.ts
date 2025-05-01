import { FastifyInstance } from "fastify"

// For wrapping node-pg errors
class PgError extends Error {
  public readonly details: string
  public readonly query: string
  public readonly originalError: Error

  constructor({ message, query, details, originalError }: { message: string; query: string; details: string; originalError: Error }) {
    super(message)
    this.name = "PgError"
    this.details = "create some detailed description using default error from node-pg!"
    this.query = query
    this.originalError = originalError
    Error.captureStackTrace(this, this.constructor) // Remove constructor clutter
  }
}

async function withPgTransaction<T>(fastify: FastifyInstance, callback: (client: any) => Promise<T>): Promise<T> {
  let client
  try {
    client = await fastify.pg.connect()
    await client.query("BEGIN")

    const result = await callback(client)

    await client.query("COMMIT")
    return result
  } catch (err: any) {
    if (client) await client.query("ROLLBACK")
    throw new PgError({
      message: "PostgreSQL transaction failed",
      details: err.detail || err.message,
      query: err.query || "Unknown query",
      originalError: err,
    })
  } finally {
    if (client) client.release()
  }
}

const runPGTransaction = async <T>(fastify: FastifyInstance, callback: (client: any) => Promise<T>): Promise<T> => {
  let client
  try {
    client = await fastify.pg.connect()
    await client.query("BEGIN")

    const result = await callback(client)

    await client.query("COMMIT")
    return result
  } catch (err: any) {
    if (client) await client.query("ROLLBACK")
    throw new PgError({
      message: "PostgreSQL transaction failed",
      details: err.detail || err.message,
      query: err.query || "Unknown query",
      originalError: err,
    })
  } finally {
    if (client) client.release()
  }
}
