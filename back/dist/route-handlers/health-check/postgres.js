export const healthCheckPostgresAPI = (fastify) => {
    return async (request, reply) => {
        if (fastify.postgresAvailable) {
            reply.code(200).send({ success: true });
        }
        else {
            reply.code(200).send({ success: false });
        }
    };
};
