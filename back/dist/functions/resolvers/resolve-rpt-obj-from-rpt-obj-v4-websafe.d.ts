import { FastifyReply } from "fastify";
export declare const resolveRptObjFromRptObjV4Websafe: (reply: FastifyReply, rptObjV4Websafe: string, userIdentifier: string) => Promise<{
    rpt: string;
    id: number;
    email: string;
}>;
