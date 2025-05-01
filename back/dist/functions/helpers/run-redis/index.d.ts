/**
 * `runRedis` helper series
 *
 * This internal module provides fault-tolerant Redis helpers that:
 * - Standardize Redis command execution across the codebase
 * - Automatically log failures and trigger Redis health checks
 * - Clarify the intent of Redis access patterns (e.g., `get`, `fireAndForget`)
 *
 * ─────────────────────────────────────────────────────────────
 * 🔹 runRedis.get.obj
 *    → `redis.get()` expecting a JSON-encoded object.
 *       Parses + validates against a TypeBox schema.
 *       Returns the decoded object or `null` if key not found.
 *
 * 🔹 runRedis.get.str
 *    → `redis.get()` expecting a raw string.
 *       Returns the string or `null` if key not found.
 *
 * 🔹 runRedis.fireAndForget
 *    → Accepts a callback and runs one or more Redis commands
 *       where return value is discarded, and only side-effects matter.
 *
 *       ⚠️ Dangerous: Any thrown error — even unrelated to Redis —
 *       will trigger Redis health checks. Use responsibly.
 *
 *       Think of this as the JS equivalent of `unsafe {}` in Rust.
 *       It works well, but must be called honestly.
 *
 * ─────────────────────────────────────────────────────────────
 *
 * These helpers are **not** generic catch-alls.
 * They exist to clarify developer intent and reduce boilerplate,
 * while offering safe, predictable Redis behavior at runtime.
 */
/**
 * `runRedis` - structured Redis utility group.
 *
 * Use this object for:
 * - Discoverable Redis helpers via `runRedis.`
 * - Stable groupings by intent (e.g., `.expecting`, `.fireAndForget`)
 * - Centralized import path: `~/functions/helpers/run-redis`
 */
export declare const runRedis: {
    /**
     * For Redis `get()` operations.
     * - `obj`: Expects a JSON string, returns parsed and validated object or null.
     * - `str`: Expects a plain string, returns raw or null.
     */
    get: {
        obj: <T extends import("@sinclair/typebox").TObject>(fastify: import("fastify").FastifyInstance, redisKey: string, userIdentifier: string | number | undefined, validator: import("@sinclair/typebox/compiler").TypeCheck<T>) => Promise<import("@sinclair/typebox").StaticDecode<T, []> | null>;
        str: (fastify: import("fastify").FastifyInstance, redisKey: string, userIdentifier?: string | number) => Promise<string | null>;
    };
    /**
     * For Redis operations with no return value (e.g. zadd, del, expire).
     */
    fireAndForget: (fastify: import("fastify").FastifyInstance, callback: () => Promise<unknown>, userIdentifier?: string | number) => Promise<void>;
};
