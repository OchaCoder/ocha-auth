import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
export declare const healthEvents: (fastify: FastifyInstance) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
