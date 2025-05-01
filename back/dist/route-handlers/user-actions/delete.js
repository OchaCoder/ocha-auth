import { Type } from "@sinclair/typebox";
export const UserDeletePayloadSchema = Type.Union([Type.Object({ at: Type.String() }, { additionalProperties: false }), Type.Object({ sid: Type.String() }, { additionalProperties: false })]);
export const userDelete = (fastify) => {
    return async (request, reply) => {
        const { at } = request.body;
        console.log("at??", at);
        reply.send({ message: "You are accessing /auth/user-delete" });
    };
};
