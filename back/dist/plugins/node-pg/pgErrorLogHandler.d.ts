import { FastifyInstance } from "fastify";
export declare const errLogPgFailedHealthCheck: (fastify: FastifyInstance) => void;
export declare const errLogPgFailedOnStartUp: (fastify: FastifyInstance, maxRetries: number) => void;
export declare const errLogPgWrongCredential: (fastify: FastifyInstance) => void;
export declare const errLogPgUserRequestNotFulfilled: (fastify: FastifyInstance, userIdentifier: string | number, userWait: number) => void;
