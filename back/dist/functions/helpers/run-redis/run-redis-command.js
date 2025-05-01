import { ErrorRedis } from "../../error-classes/error-redis.js";
import { errLogIoredisUserRequestNotFulfilled, errLogIoredisUserRequestNotFulfilledUnknown } from "../loggers/log-ioredis-error.js";
export const runRedisCommand = async (fastify, callback, userIdentifier) => {
    const requestSentAt = Date.now();
    try {
        const data = await callback();
        return data;
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
        throw new ErrorRedis({ originalErr: err });
    }
};
