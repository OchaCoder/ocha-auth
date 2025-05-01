import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

export const healthCheckRedisAPI = (fastify: FastifyInstance) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (fastify.redisAvailable) {
      reply.code(200).send({ success: true })
    } else {
      reply.code(200).send({ success: false })
    }
  }
}
