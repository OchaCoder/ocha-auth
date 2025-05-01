export const healthCheckRedisAPI = (fastify) => {
    return async (request, reply) => {
        if (fastify.redisAvailable) {
            reply.code(200).send({ success: true });
        }
        else {
            reply.code(200).send({ success: false });
        }
    };
};
