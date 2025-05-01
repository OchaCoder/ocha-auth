/**
 * `runRedis` helper series
 *
 * This module contains fault-tolerant Redis helpers that standardize:
 * - Executing Redis commands safely
 * - Handling Redis failures (e.g., downtime, retry exhaustion)
 * - Triggering Redis health checks when needed
 *
 * Each helper is focused and single-purpose:
 *
 * • `runRedisCommandFireAndForget`
 *    → For Redis commands that return no value (e.g., `zadd`, `del`)
 *
 * • `runRedisGetExpecting`
 *    → For `redis.get()` responses expected to be JSON strings.
 *       Validates and decodes the parsed object using TypeBox.
 *
 * These are not generic catch-all wrappers —
 * They exist to clarify intent and reduce boilerplate
 * around Redis usage, failure handling, and data shape validation.
 */
export { runRedisCommandFireAndForget } from "./run-redis-command-fire-and-forget.js";
export { runRedisGetExpecting } from "./run-redis-get-expecting.js";
