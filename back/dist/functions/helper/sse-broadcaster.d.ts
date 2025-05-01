import { FastifyInstance } from "fastify";
export declare const connectedClients: Set<{
    send: (data: any) => void;
}>;
export declare const broadcastCurrentHealth: (fastify: FastifyInstance) => void;
export declare const sseHealth: (fastify: FastifyInstance) => void;
