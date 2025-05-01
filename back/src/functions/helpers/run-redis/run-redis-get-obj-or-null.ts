import { FastifyInstance } from "fastify"
import { TypeCheck } from "@sinclair/typebox/compiler"
import { StaticDecode, TObject } from "@sinclair/typebox"
import { errLogIoredisUserRequestNotFulfilled, errLogIoredisUserRequestNotFulfilledUnknown } from "../../loggers/log-ioredis-error.js"
import { ErrorRedis } from "../../../error-classes/error-redis.js"
import { ErrorDefensiveGuardBreach } from "../../../error-classes/error-defensive-guard-breach.js"

/**
 * `runRedisGetObjOrNull` is part of the `runRedis` helper series,
 * which standardizes how Redis commands are executed and how failures are handled.
 *
 * Use this helper when:
 * - The expected return value from `redis.get()` is a JSON string
 * - You want to handle `null` cases explicitly in the caller
 * - You want the returned data (if present) to be parsed and schema-validated
 *
 * All `runRedis` helpers:
 * - Run Redis commands in a predictable, fault-tolerant way
 * - Automatically handle Redis downtime and trigger health checks when needed
 *
 * ⚠️ Do not pass a Redis key that returns a regular (non-JSON) string.
 * This will result in an `ERR_BAD_REDIS_DATA` error during the JSON parsing stage.
 * To prevent misuse, the `validator` argument is required and non-optional.
 *
 * @returns The parsed and validated object if the key exists, or `null` if the key is missing
 */

export const runRedisGetObjOrNull = async <T extends TObject>(
  fastify: FastifyInstance,
  redisKey: string,
  userIdentifier: string | number = "",
  validator: TypeCheck<T>
): Promise<StaticDecode<T, []> | null> => {
  const requestSentAt = Date.now()
  let rawData
  try {
    rawData = await fastify.redis.get(redisKey)
  } catch (err: any) {
    const requestTimeoutAt = Date.now()
    const userWait = requestTimeoutAt - requestSentAt
    if (err.message.includes("maxRetriesPerRequest")) {
      errLogIoredisUserRequestNotFulfilled(fastify, userIdentifier, userWait)

      fastify.healthRedis("SPECIAL") // Immediately start the health check!
    } else {
      // Log unknown Redis error in detailed form
      errLogIoredisUserRequestNotFulfilledUnknown(fastify, err, userIdentifier, userWait)

      fastify.healthRedis("SPECIAL") // Immediately start the health check!
    }
    throw new ErrorRedis(err, "ERR_REDIS_DOWN")
  }

  // Defensive guard — this should never occur if the Redis command was used correctly.
  if (rawData === undefined) throw new ErrorDefensiveGuardBreach("ERR_BAD_REDIS_COMMAND")

  // The key doesn't exist in Redis, which could mean it was:
  // 1. Never set
  // 2. Deleted manually
  // 3. Expired due to TTL
  // 4. Overwritten by another key
  // 5. Misspelled or constructed incorrectly
  //
  // This helper returns `null` instead of throwing a fixed error like 'ERR_REDIS_KEY_NOT_FOUND'
  // to allow the caller to evaluate the context and choose how to respond
  // (e.g., deny access, retry, or fallback).
  if (rawData === null) return null

  let parsedData

  // If the key exists, `redis.get()` always returns a string.
  // That string will either be:
  // 1. A plain string (e.g., "true", "hello", "42"), or
  // 2. A JSON-parsable string (e.g., '{"foo":"bar"}')
  //
  // This helper strictly expects the value to be a valid JSON string.
  // Passing a key that returns a regular string will result in a parsing error below.
  if (typeof rawData === "string") {
    try {
      parsedData = JSON.parse(rawData)
    } catch {
      // rawData is not a JSON string. This may indicate
      // 1. a misconfiguration during the 'set' stage.
      // 2. wrong choice of helper
      throw new ErrorDefensiveGuardBreach(`ERR_BAD_REDIS_DATA`, `Expected JSON string was not set. Check the logic that writes to this Redis key.`)
    }
  }

  if (!validator.Check(parsedData))
    throw new ErrorDefensiveGuardBreach(`ERR_BAD_REDIS_COMMAND_OR_SCHEMA`, `Returned data does not match the expected schema. Likely a wrong redis command or bug in the TypeBox schema.`)

  return validator.Decode(parsedData)
}
