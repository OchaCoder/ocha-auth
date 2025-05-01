import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
export declare const playWithErrors: (fastify: FastifyInstance) => (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
