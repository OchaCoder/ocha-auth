import { FastifyReply } from "fastify";
export declare const verifyPasetoV4: (reply: FastifyReply, v4Token: string, key: string, userIdentity: string) => Promise<Record<string, unknown>>;
