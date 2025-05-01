import { FastifyInstance, FastifyRequest } from "fastify"

export type ProtectedRequest = FastifyRequest & {
  user?: { id: number } | null
}

export type ProtectedFastify = FastifyInstance
