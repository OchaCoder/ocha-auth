import "fastify" // Ensure Fastify's types are loaded
import Redis from "ioredis"

declare module "fastify" {
  interface FastifyInstance {
    redisAvailable: boolean
    healthIdRedis: NodeJS.Timeout | null
    healthRedis: (checkType: "STARTUP" | "ROUTINE" | "SPECIAL" | "EMERGENCY") => void

    postgresAvailable: boolean
    healthIdPostgres: NodeJS.Timeout | null
    healthPostgres: (checkType: "STARTUP" | "ROUTINE" | "SPECIAL" | "EMERGENCY") => void
  }
}
