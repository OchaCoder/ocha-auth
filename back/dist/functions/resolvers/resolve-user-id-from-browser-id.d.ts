import { FastifyInstance, FastifyReply } from "fastify";
/**
 * Use this resolver to authenticate user using browser ID `bid`.
 * @param fastify
 * @param reply
 * @param browserId
 * @returns userId which is a type of number.
 */
export declare const resolveUserIdFromBrowserId: (fastify: FastifyInstance, reply: FastifyReply, browserId: unknown) => Promise<number>;
