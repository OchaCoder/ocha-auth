import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
export declare const healthCheckRedisAPI: (fastify: FastifyInstance) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
