import { Static } from "@sinclair/typebox";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
export declare const UserDeletePayloadSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
    at: import("@sinclair/typebox").TString;
}>, import("@sinclair/typebox").TObject<{
    sid: import("@sinclair/typebox").TString;
}>]>;
export type UserDeletePayload = Static<typeof UserDeletePayloadSchema>;
export declare const userDelete: (fastify: FastifyInstance) => (request: FastifyRequest<{
    Body: UserDeletePayload;
}>, reply: FastifyReply) => Promise<void>;
