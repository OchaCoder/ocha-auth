import { FastifyInstance } from "fastify";
export declare const ioredisOptions: (fastify: FastifyInstance) => {
    url: string;
    socketTimeout: number;
    connectTimeout: number;
    retryStrategy: (attempt: number) => number;
    enableOfflineQueue: boolean;
    maxRetriesPerRequest: number;
};
