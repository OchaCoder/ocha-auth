export {};
// Special health check
// export const redisHealthSuspicious = async (fastify: FastifyInstance) => {
//     const healthCheckRedis = async (stable: string, down: string) => {
//         const now = new Date().toISOString()
//         try {
//           // Health check
//           await fastify.redis.ping()
//           // Redis is stable
//           fastify.redisAvailable = true
//           fastify.redisSuspiciousCondition = false
//           console.log(`${now}${stable}`)
//           if (activeInterval) clearInterval(activeInterval)
//           runRedisHealthRoutine()
//         } catch (err) {
//           // Redis is down
//           fastify.redisAvailable = false
//           console.error(`${now}${down}`)
//           if (activeInterval) clearInterval(activeInterval)
//           runRedisHealthEmergency()
//         }
//       }
//     const stable = `:: ✅ [REDIS::HEALTH::SPECIAL] :: Special check due to suspicious flag. Connection is stable.`
//     const down = `:: ⛔️ [REDIS::HEALTH::SPECIAL] :: Special check due to suspicious flag. Connection is DOWN!`
//     await healthCheckRedis(fastify, stable, down)
//   }
