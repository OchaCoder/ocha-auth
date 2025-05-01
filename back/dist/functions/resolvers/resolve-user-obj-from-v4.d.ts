import { FastifyReply } from "fastify";
export declare const resolveUserObjectFromV4: (reply: FastifyReply, expectUserObjV4: string, userIdentifier: string) => Promise<{
    id: number;
    email: string;
}>;
