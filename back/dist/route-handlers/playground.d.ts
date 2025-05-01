import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
export declare const playground: (fastify: FastifyInstance) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
