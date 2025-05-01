import { FastifyInstance } from "fastify";
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
export declare const runRedisCommandFireAndForget: (fastify: FastifyInstance, callback: () => Promise<void>, userIdentifier?: string | number) => Promise<void>;
