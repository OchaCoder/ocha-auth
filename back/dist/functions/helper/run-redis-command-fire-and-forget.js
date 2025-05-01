import { ErrorRedis } from "../../error-classes/error-redis.js";
import { errLogIoredisUserRequestNotFulfilled, errLogIoredisUserRequestNotFulfilledUnknown } from "../loggers/log-ioredis-error.js";
/**
 * `runRedisCommandFireAndForget` is part of the `runRedis` helper series,
 * which standardizes how Redis commands are executed and how failures are handled.
 *
 * Use this helper when:
 * - You don't need to return any data
 * - You want to wrap one or more Redis operations into a single clean callback
 *
 * All `runRedis` helpers:
 * - Run Redis commands in a predictable, fault-tolerant way
 * - Automatically handle Redis downtime and trigger health checks when needed
 *
 * A realistic example of the expected callback might involve:
 * - Retrieving an array of IDs from a sorted set
 * - Mapping the array to delete associated keys
 *
 * @returns void
 */
export const runRedisCommandFireAndForget = async (fastify, callback, userIdentifier = "") => {
    // 1. This timestamp is useful to calculate user wait time in case of Redis down.
    const requestSentAt = Date.now();
    try {
        const data = await callback();
    }
    catch (err) {
        const requestTimeoutAt = Date.now();
        const userWait = requestTimeoutAt - requestSentAt;
        if (err.message.includes("maxRetriesPerRequest")) {
            errLogIoredisUserRequestNotFulfilled(fastify, userIdentifier, userWait);
            fastify.healthRedis("SPECIAL"); // Immediately start the check!
        }
        else {
            // Log unknown Redis error in detailed form
            errLogIoredisUserRequestNotFulfilledUnknown(fastify, err, userIdentifier, userWait);
            fastify.healthRedis("SPECIAL"); // Immediately start the check!
        }
        throw new ErrorRedis(err);
    }
};
