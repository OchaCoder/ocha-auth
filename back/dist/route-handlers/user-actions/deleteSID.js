import { Type } from "@sinclair/typebox";
export const UserDeletePayloadSchema = Type.String();
export const userDeleteSID = async (fastify) => {
    return async (request, reply) => {
        const sid = request.body;
        if (typeof sid !== "string")
            throw new Error("ERR_INVALID_RT_TYPE");
        const { redis } = fastify;
        const rt = redis.get(sid);
        console.log("rt", rt);
        reply.send({ message: "You are accessing /auth/user-delete" });
    };
};
