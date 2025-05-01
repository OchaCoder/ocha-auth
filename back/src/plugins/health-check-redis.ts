import chalk from "chalk"
import fp from "fastify-plugin"
import { errLogIoredisFailedHealthCheck } from "../functions/loggers/log-ioredis-error.js"
import { sseHealth } from "../functions/helpers/sse-broadcaster.js"

export const healthCheckRedis = fp(async (fastify) => {
  // Store the timeout ID to manage recurring health checks
  fastify.decorate("redisAvailable", false)
  fastify.decorate("healthIdRedis", null)

  fastify.addHook("onClose", (instance, done) => {
    if (fastify.healthIdRedis) clearTimeout(fastify.healthIdRedis)
    console.log(chalk.green(`${new Date().toISOString()} :: ✅ healthCheckRedis :: timeout was cleared up.`))
    done()
  })

  /**
   * Runs a Redis health check and schedules the next check.
   * Depending on the result, it either:
   * - Continues with routine checks if Redis is stable.
   * - Switches to emergency mode if Redis is unresponsive.
   */
  const healthCheckRedis = (checkType: "STARTUP" | "ROUTINE" | "SPECIAL" | "EMERGENCY") => {
    // Clear any existing scheduled health check before setting a new one
    if (fastify.healthIdRedis) clearTimeout(fastify.healthIdRedis)

    let stableMessage, downMessage
    let interval = 1000 * 2 // Default interval: 2 seconds for fast recovery checks
    const routineInterval = 1000 * 60

    switch (checkType) {
      case "STARTUP":
        stableMessage = `:: ✅ [REDIS::HEALTH::STARTUP_CHECK] :: Passed with latency of `
        downMessage = `:: ⛔️ [REDIS::HEALTH::STARTUP_CHECK] :: Connection is DOWN!`
        break
      case "ROUTINE":
        stableMessage = `:: ✅ [REDIS::HEALTH::ROUTINE_CHECK] :: Passed with latency of `
        downMessage = `:: ⛔️ [REDIS::HEALTH::ROUTINE_CHECK] :: Connection is DOWN!`
        break
      case "SPECIAL":
        stableMessage = `:: ✅ [REDIS::HEALTH::SPECIAL_CHECK] :: Suspicious flag triggered. Check passed with latency of `
        downMessage = `:: ⛔️ [REDIS::HEALTH::SPECIAL_CHECK] :: Suspicious flag triggered. Connection is DOWN!`
        break
      case "EMERGENCY":
        stableMessage = `:: ✅ [REDIS::HEALTH::EMERGENCY_CHECK] :: Connection restored. Latency: `
        downMessage = `:: ⛔️ [REDIS::HEALTH::EMERGENCY_CHECK] :: Connection is DOWN!`
        break
    }

    // Perform the Redis health check asynchronously and schedule the next check
    ;(async () => {
      try {
        // Measure Redis ping latency
        const before = Date.now()
        await fastify.redis.ping()
        const after = Date.now()
        const latency = `${after - before}ms.`

        // Mark Redis as available
        fastify.redisAvailable = true

        // Decide whether push needs to be sent
        sseHealth(fastify)

        console.log(chalk.green(`${new Date().toISOString()}${stableMessage}${chalk.bold(`${latency}`)}`))

        // If the check was "ROUTINE" and Redis is stable, extend the interval
        if (checkType === "ROUTINE") interval = routineInterval // Increase routine interval to reduce unnecessary pings

        // Schedule the next routine check
        fastify.healthIdRedis = setTimeout(() => healthCheckRedis("ROUTINE"), interval)
      } catch {
        // If Redis is down, log the failure and switch to emergency checks

        // Detailed log only the first time.
        if (fastify.redisAvailable) errLogIoredisFailedHealthCheck(fastify)
        // Simpler log for the continuous down detection.
        else console.error(chalk.red(`${new Date().toISOString()}${downMessage}`))

        fastify.redisAvailable = false

        // Decide whether push needs to be sent
        sseHealth(fastify)

        // Schedule an emergency health check
        fastify.healthIdRedis = setTimeout(() => healthCheckRedis("EMERGENCY"), interval)
      }
    })()
  }

  // Expose the health check function via Fastify's decorator system
  // Use is as healthRedis("STARTUP") or healthRedis("SPECIAL").
  fastify.decorate("healthRedis", healthCheckRedis)
})
