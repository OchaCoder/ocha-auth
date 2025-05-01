import { FastifyInstance } from "fastify";
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
export declare const runRedisGetStringOrNull: (fastify: FastifyInstance, redisKey: string, userIdentifier?: string | number) => Promise<string | null>;
