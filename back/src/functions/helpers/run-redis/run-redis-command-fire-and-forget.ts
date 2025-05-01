import { FastifyInstance } from "fastify"
import { errLogIoredisUserRequestNotFulfilled, errLogIoredisUserRequestNotFulfilledUnknown } from "../../loggers/log-ioredis-error.js"
import { ErrorRedis } from "../../../error-classes/error-redis.js"

/**
 * ⚠️ WARNING: Any non-Redis error thrown inside the callback will falsely
 * trigger a Redis health check.
 *
 * ⚠️ WARNING: The return value of the Redis command (e.g., `"OK"` or a number) is intentionally ignored.
 * Do not use this helper if you need to evaluate the Redis response.
 *
 * `runRedisCommandFireAndForget` is part of the `runRedis` helper series,
 * which standardizes how Redis commands are executed and how failures are handled.
 *
 * Use this helper when:
 * - You want to wrap one or more Redis operations into a clean, disposable callback
 * - You are running a Redis command for its side-effect, not its return value
 *   (e.g., `SET`, `DEL`, `ZADD`, `EXPIRE`, etc.)
 * - You are okay with discarding the Redis return (e.g., `"OK"` or a number)
 *
 * All `runRedis` helpers:
 * - Run Redis commands in a predictable, fault-tolerant way
 * - Automatically handle Redis downtime and trigger health checks when needed
 *
 * A realistic example of the expected callback might involve:
 * - Retrieving an array of IDs from a sorted set
 * - Mapping the array to delete associated keys
 *
 * @returns void — this helper never returns the Redis response.
 */

export const runRedisCommandFireAndForget = async (fastify: FastifyInstance, callback: () => Promise<unknown>, userIdentifier: string | number = ""): Promise<void> => {
  // This timestamp is useful to calculate user wait time in case of Redis down.
  const requestSentAt = Date.now()

  try {
    // ⚠️ Be mindful of what this callback includes.
    // Any error — even if unrelated to Redis — will trigger a Redis health check.

    const _response = await callback()

    // ⚠️ Redis response is intentionally discarded — this is a fire-and-forget command.
  } catch (err: any) {
    const requestTimeoutAt = Date.now()

    const userWait = requestTimeoutAt - requestSentAt

    if (err.message.includes("maxRetriesPerRequest")) {
      errLogIoredisUserRequestNotFulfilled(fastify, userIdentifier, userWait)

      fastify.healthRedis("SPECIAL") // Immediately start the check!
    } else {
      // Log unknown Redis error in detailed form
      errLogIoredisUserRequestNotFulfilledUnknown(fastify, err, userIdentifier, userWait)

      fastify.healthRedis("SPECIAL") // Immediately start the check!
    }
    throw new ErrorRedis(err, "ERR_REDIS_DOWN")
  }
}
