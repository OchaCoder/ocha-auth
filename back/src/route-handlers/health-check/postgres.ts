import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

export const healthCheckPostgresAPI = (fastify: FastifyInstance) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (fastify.postgresAvailable) {
      reply.code(200).send({ success: true })
    } else {
      reply.code(200).send({ success: false })
    }
  }
}
