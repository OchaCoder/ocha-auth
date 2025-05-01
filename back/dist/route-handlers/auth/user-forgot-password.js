export const userForgotPassowrd = (fastify) => {
    return (request, reply) => {
        reply.send({ message: "you are accessing /auth/user-forgot-password" });
    };
};
