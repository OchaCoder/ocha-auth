/**
 * Catches Errors inside Fastify routes, hooks, and middleware.
 * Only works on errors from within Fastify’s request-response cycle.
 */
export declare const errorHandlerPlugin: (fastify: import("fastify").FastifyInstance<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>) => Promise<void>;
