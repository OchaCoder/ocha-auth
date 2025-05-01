import { FastifyInstance } from "fastify";
export declare const ioredisErrorDumper: (fastify: FastifyInstance) => (err: unknown) => void;
export declare const errLogIoredisETIMEDOUT: (fastify: FastifyInstance, err: Error) => void;
export declare const errLogIoredisSocketTimeout: (fastify: FastifyInstance) => void;
