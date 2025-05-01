export const userSignin = (fastify) => {
    return async (request, reply) => {
        reply.send({ message: "You accessed /auth/user-signin/" });
    };
};
