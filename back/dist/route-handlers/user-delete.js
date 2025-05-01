export const userDelete = (fastify) => {
    return async (request, reply) => {
        reply.send({ message: "You are accessing /auth/user-delete" });
    };
};
