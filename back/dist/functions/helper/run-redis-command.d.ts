import { FastifyInstance } from "fastify";
export declare const runRedisCommand: <T>(fastify: FastifyInstance, callback: () => Promise<T>, userIdentifier: string | number) => Promise<T | null>;
