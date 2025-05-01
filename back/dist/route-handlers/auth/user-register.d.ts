import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Static } from "@sinclair/typebox";
export declare const UserRegisterPayloadSchema: import("@sinclair/typebox").TObject<{
    payload: import("@sinclair/typebox").TObject<{
        hasData: import("@sinclair/typebox").TLiteral<true>;
        data: import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            email: import("@sinclair/typebox").TString;
            password: import("@sinclair/typebox").TString;
        }>;
    }>;
}>;
export type UserRegisterPayload = Static<typeof UserRegisterPayloadSchema>;
export declare const userRegister: (fastify: FastifyInstance) => (request: FastifyRequest, reply: FastifyReply) => Promise<never>;
