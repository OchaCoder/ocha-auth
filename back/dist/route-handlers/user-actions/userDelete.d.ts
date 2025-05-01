import { Static } from "@sinclair/typebox";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
export declare const UserDeletePayloadSchema: import("@sinclair/typebox").TString;
export type UserDeletePayload = Static<typeof UserDeletePayloadSchema>;
export declare const userDelete: (fastify: FastifyInstance) => (request: FastifyRequest<{
    Body: String;
}>, reply: FastifyReply) => Promise<void>;
