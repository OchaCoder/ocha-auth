export const userUpdate = (fastify) => {
    return async (request, reply) => {
        reply.send({ message: "You are accessing /auth/user-update/" });
    };
};
