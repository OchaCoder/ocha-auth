import { FastifyReply } from "fastify";
import { ProtectedFastify, ProtectedRequest } from "../../type.js";
export declare const RequestBodyUserUpdateSchema: import("@sinclair/typebox").TObject<{
    at: import("@sinclair/typebox").TString;
    payload: import("@sinclair/typebox").TObject<{
        hasData: import("@sinclair/typebox").TLiteral<true>;
        data: import("@sinclair/typebox").TObject<{
            oldValues: import("@sinclair/typebox").TObject<{
                name: import("@sinclair/typebox").TString;
                email: import("@sinclair/typebox").TString;
            }>;
            newValues: import("@sinclair/typebox").TObject<{
                name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                email: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            }>;
        }>;
    }>;
}>;
export declare const userUpdate: (fastify: ProtectedFastify) => (request: ProtectedRequest, reply: FastifyReply) => Promise<void>;
