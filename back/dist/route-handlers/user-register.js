export const userRegister = (fastify) => {
    return async (request, reply) => {
        reply.send({ message: "You accessed /auth/user-register/" });
    };
};
