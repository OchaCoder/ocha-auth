import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Static } from "@sinclair/typebox";
export declare const RedisRptSchema: import("@sinclair/typebox").TObject<{
    isUsed: import("@sinclair/typebox").TBoolean;
}>;
export type RedisRpt = Static<typeof RedisRptSchema>;
export declare const UserResetPasswordVerifyTokenSchema: import("@sinclair/typebox").TObject<{
    payload: import("@sinclair/typebox").TObject<{
        hasData: import("@sinclair/typebox").TLiteral<true>;
        data: import("@sinclair/typebox").TObject<{
            rpt: import("@sinclair/typebox").TString;
        }>;
    }>;
}>;
export type UserResetPasswordVerifyToken = Static<typeof UserResetPasswordVerifyTokenSchema>;
export declare const userResetPasswordVerifyToken: (fastify: FastifyInstance) => (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
