import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
export declare const userRefreshAt: (fastify: FastifyInstance) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
