import { Static } from "@sinclair/typebox";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
export declare const UserDeletePayloadSchema: import("@sinclair/typebox").TString;
declare const requestPayloadSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    email: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    password: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
type RequestPayload = Static<typeof requestPayloadSchema>;
export declare const userUpdateAT: (fastify: FastifyInstance) => (request: FastifyRequest<{
    Body: RequestPayload;
}>, reply: FastifyReply) => Promise<void>;
export {};
