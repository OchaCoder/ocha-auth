import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Static } from "@sinclair/typebox";
export declare const UserResetPasswordPostEmailSchema: import("@sinclair/typebox").TObject<{
    payload: import("@sinclair/typebox").TObject<{
        hasData: import("@sinclair/typebox").TLiteral<true>;
        data: import("@sinclair/typebox").TObject<{
            password: import("@sinclair/typebox").TString;
            rpt: import("@sinclair/typebox").TString;
        }>;
    }>;
}>;
export type UserResetPasswordSchemaPostEmail = Static<typeof UserResetPasswordPostEmailSchema>;
export declare const userResetPasswordPostEmail: (fastify: FastifyInstance) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
