import { FastifyInstance } from "fastify";
import { TypeCheck } from "@sinclair/typebox/compiler";
import { StaticDecode, TObject } from "@sinclair/typebox";
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
export declare const runRedisGetObjOrNull: <T extends TObject>(fastify: FastifyInstance, redisKey: string, userIdentifier: string | number | undefined, validator: TypeCheck<T>) => Promise<StaticDecode<T, []> | null>;
