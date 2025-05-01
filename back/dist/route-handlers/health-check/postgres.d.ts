import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
export declare const healthCheckPostgresAPI: (fastify: FastifyInstance) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
