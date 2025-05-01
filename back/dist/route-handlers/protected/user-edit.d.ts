import { FastifyReply } from "fastify";
import { ProtectedFastify, ProtectedRequest } from "../../type.js";
export declare const userEdit: (fastify: ProtectedFastify) => (request: ProtectedRequest, reply: FastifyReply) => Promise<void>;
