import { FastifyReply } from "fastify";
export declare const resolveUserIdFromAccessToken: (reply: FastifyReply, accessToken: unknown, userIdentifier: string) => Promise<number>;
