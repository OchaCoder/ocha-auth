import { FastifyInstance } from "fastify";
export declare const errLogIoredisFailedHealthCheck: (fastify: FastifyInstance) => void;
export declare const errLogIoredisUserRequestNotFulfilled: (fastify: FastifyInstance, userIdentifier: string | number, userWait: number) => void;
export declare const errLogIoredisFailedOnStartUp: (fastify: FastifyInstance) => void;
export declare const errLogIoredisUserRequestNotFulfilledUnknown: (fastify: FastifyInstance, err: Error, userIdentifier: string | number, userWait: number) => void;
