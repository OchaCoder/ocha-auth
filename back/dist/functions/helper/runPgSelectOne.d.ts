import { FastifyInstance } from "fastify";
export declare const runPgSExists: (fastify: FastifyInstance, query: string, values: any[] | undefined, userIdentifier: string | number) => Promise<boolean>;
