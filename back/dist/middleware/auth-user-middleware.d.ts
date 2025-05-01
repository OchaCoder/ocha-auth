import { FastifyReply, FastifyRequest } from "fastify";
export declare const authUserMiddleware: (request: FastifyRequest<{
    Body: {
        at: string;
    };
}>, reply: FastifyReply) => Promise<void>;
