import { FastifyReply } from "fastify";
export declare const resolveUserObjectFromRpt: (reply: FastifyReply, rptV4Websafe: string, userIdentifier: string) => Promise<{
    id: number;
    email: string;
}>;
