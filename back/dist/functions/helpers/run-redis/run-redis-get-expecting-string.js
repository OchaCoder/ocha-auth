import { errLogIoredisUserRequestNotFulfilled, errLogIoredisUserRequestNotFulfilledUnknown } from "../../loggers/log-ioredis-error.js";
import { ErrorRedis } from "../../../error-classes/error-redis.js";
import { ErrorDefensiveGuardBreach } from "../../../error-classes/error-defensive-guard-breach.js";
/**
 * `runRedisGetExpectingValidatedString` is part of the `runRedis` helper series,
 * which standardizes how Redis commands are executed and how failures are handled.
 *
 * Use this helper when:
 * - You expect `redis.get()` to return a regular (non-JSON) string
 * - You want to handle `null` cases explicitly in the caller
 *
 * All `runRedis` helpers:
 * - Run Redis commands in a predictable, fault-tolerant way
 * - Automatically log Redis failures and trigger health checks when needed
 *
 * ⚠️ For JSON-parsed values, use `runRedisGetExpectingValidatedObj` instead.
 *
 * @returns The raw string if the key exists, or `null` if the key is missing or expired
 */
export const runRedisGetStringOrNull = async (fastify, redisKey, userIdentifier = "") => {
    const requestSentAt = Date.now();
    let rawData;
    try {
        rawData = await fastify.redis.get(redisKey);
    }
    catch (err) {
        const requestTimeoutAt = Date.now();
        const userWait = requestTimeoutAt - requestSentAt;
        if (err.message.includes("maxRetriesPerRequest")) {
            errLogIoredisUserRequestNotFulfilled(fastify, userIdentifier, userWait);
            fastify.healthRedis("SPECIAL"); // Immediately start the health check!
        }
        else {
            // Log unknown Redis error in detailed form
            errLogIoredisUserRequestNotFulfilledUnknown(fastify, err, userIdentifier, userWait);
            fastify.healthRedis("SPECIAL"); // Immediately start the health check!
        }
        throw new ErrorRedis(err);
    }
    // Defensive guard — this should never occur if the Redis command is correct.
    // Most likely caused by incorrect Redis client usage.
    if (rawData === undefined)
        throw new ErrorDefensiveGuardBreach("ERR_BAD_REDIS_COMMAND", `redis.get(${redisKey}) unexpectedly returned undefined.`);
    // Key not found in Redis — could be due to:
    // 1. TTL expiration
    // 2. Never set
    // 3. Manual deletion
    // 4. Key overwriting
    // 5. Incorrect key construction
    //
    // Returning `null` allows the caller to decide the next step (deny access, retry, etc.)
    if (rawData === null)
        return null;
    return rawData;
};
