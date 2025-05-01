import { FastifyRequest } from "fastify";
export type ProtectedRequest = FastifyRequest & {
    user: {
        id: number;
    };
};
