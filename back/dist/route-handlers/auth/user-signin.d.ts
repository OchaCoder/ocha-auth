import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Static } from "@sinclair/typebox";
export declare const UserSignInPayloadSchema: import("@sinclair/typebox").TObject<{
    payload: import("@sinclair/typebox").TObject<{
        hasData: import("@sinclair/typebox").TLiteral<true>;
        data: import("@sinclair/typebox").TObject<{
            email: import("@sinclair/typebox").TString;
            password: import("@sinclair/typebox").TString;
            bid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
    }>;
}>;
export type UserSignInPayload = Static<typeof UserSignInPayloadSchema>;
export declare const userSignin: (fastify: FastifyInstance) => (request: FastifyRequest, reply: FastifyReply) => Promise<never>;
