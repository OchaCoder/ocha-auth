import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Static } from "@sinclair/typebox";
export declare const UserResetPasswordSchemaPreEmailSchema: import("@sinclair/typebox").TObject<{
    payload: import("@sinclair/typebox").TObject<{
        hasData: import("@sinclair/typebox").TLiteral<true>;
        data: import("@sinclair/typebox").TObject<{
            email: import("@sinclair/typebox").TString;
        }>;
    }>;
}>;
export type UserResetPasswordSchemaPreEmail = Static<typeof UserResetPasswordSchemaPreEmailSchema>;
export declare const userResetPasswordPreEmail: (fastify: FastifyInstance) => (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
