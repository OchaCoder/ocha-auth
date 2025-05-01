/**
 * `runPg` helper series
 *
 * A grouped interface for safe, fault-tolerant PostgreSQL operations.
 * Each helper handles connection acquisition, error logging,
 * and health-check triggering on failure.
 *
 * Categorized into:
 * - `bool`: boolean-returning queries
 *
 * - `query`: single-statement operations
 *
 * - `transaction`: multi-statement atomic operations
 *   ⚠️ Dangerous: Use the callback with care — misuse can trigger false health checks.
 */
export declare const runPg: {
    bool: {
        exists: (fastify: import("fastify").FastifyInstance, query: string, values: any[] | undefined, userIdentifier: string | number) => Promise<boolean>;
        modify: (fastify: import("fastify").FastifyInstance, query: string, values: any[] | undefined, userIdentifier?: string | number) => Promise<boolean>;
    };
    query: {
        fireAndForget: (fastify: import("fastify").FastifyInstance, query: string, values: any[] | undefined, userIdentifier?: string | number) => Promise<void>;
        obj: <T extends import("@sinclair/typebox").TObject>(fastify: import("fastify").FastifyInstance, query: string, values: any[] | undefined, userIdentifier: string | number | undefined, validator: import("@sinclair/typebox/compiler").TypeCheck<T>) => Promise<import("@sinclair/typebox").StaticDecode<T, []> | null>;
    };
    transaction: {
        fireAndForget: (fastify: import("fastify").FastifyInstance, callback: (client: import("pg").PoolClient) => Promise<{
            rows: unknown[];
        }>, userIdentifier?: string | number) => Promise<void>;
        obj: <T extends import("@sinclair/typebox").TObject>(fastify: import("fastify").FastifyInstance, callback: (client: import("pg").PoolClient) => Promise<{
            rows: unknown[];
        }>, userIdentifier: string | number | undefined, validator: import("@sinclair/typebox/compiler").TypeCheck<T>) => Promise<import("@sinclair/typebox").StaticDecode<T, []> | null>;
    };
};
