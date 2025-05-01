import { FastifyReply } from "fastify";
import { ProtectedFastify, ProtectedRequest } from "../../type.js";
export declare const RequestBodyUserSignOutFromOneSchema: import("@sinclair/typebox").TObject<{
    at: import("@sinclair/typebox").TString;
    payload: import("@sinclair/typebox").TObject<{
        hasData: import("@sinclair/typebox").TLiteral<true>;
        data: import("@sinclair/typebox").TObject<{
            bid: import("@sinclair/typebox").TString;
        }>;
    }>;
}>;
export declare const userSignOutFromOne: (fastify: ProtectedFastify) => (request: ProtectedRequest, reply: FastifyReply) => Promise<void>;
