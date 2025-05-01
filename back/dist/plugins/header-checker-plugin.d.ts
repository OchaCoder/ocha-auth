import { FastifyInstance } from "fastify";
/**
 * Checks incoming headers for a certain key and value to only let
 * requests through that pass the test.
 */
export declare const headerCheckerPlugin: (fastify: FastifyInstance) => Promise<void>;
