import { ErrorRedis } from "../../error-classes/error-redis.js";
import { errLogIoredisUserRequestNotFulfilled, errLogIoredisUserRequestNotFulfilledUnknown } from "../loggers/log-ioredis-error.js";
import { ErrorDefensiveGuardBreach } from "../../error-classes/error-defensive-guard-breach.js";
/**
 * This helper is designed for Redis commands that return data.
 *
 * It parses and validates the returned data against a provided TypeBox schema.
 *
 * @returns The decoded and validated data, or `null` if the key was not found.
 */
export const runRedisGetExpecting = async (fastify, callback, userIdentifier = "", validator) => {
    const requestSentAt = Date.now();
    let rawData;
    try {
        rawData = await callback();
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
    // Defensive guard — this should never trigger if the command was written correctly.
    if (rawData === undefined)
        throw new ErrorDefensiveGuardBreach("ERR_BAD_REDIS_COMMAND");
    // The key doesn’t exist in the DB because it was -
    // 1. never set
    // 2. deleted manually
    // 3. expired due to TTL
    // 4. overwritten with another name
    // 5. misspelled
    // Returning 'null' allows room for the caller to carefully evaluate the scenario
    // and take appropriate action depending on each case's requirements.
    if (rawData === null)
        return null;
    let parsedData;
    if (typeof rawData === "string") {
        try {
            parsedData = JSON.parse(rawData);
        }
        catch {
            // rawData is not a JSON string. This may indicate a misconfiguration during the 'set' stage.
            throw new ErrorDefensiveGuardBreach(`ERR_BAD_REDIS_DATA`, `Expected JSON string was not set. Check the logic that writes to this Redis key.`);
        }
    }
    if (!validator.Check(parsedData))
        throw new ErrorDefensiveGuardBreach(`ERR_BAD_REDIS_COMMAND_OR_SCHEMA`, `Returned data does not match the expected schema. Likely a wrong redis command or bug in the TypeBox schema.`);
    return validator.Decode(parsedData);
};
