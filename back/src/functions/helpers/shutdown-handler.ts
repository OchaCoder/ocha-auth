// 🧼 Listen for Ctrl+C or system termination

import { FastifyInstance } from "fastify"
import { logShutdownMessage } from "../loggers/log-shutdown-message.js"

export const shutdownHandler = async (fastify: FastifyInstance) => {
  console.log("\n🔌 Shutdown signal received. Cleaning up...")

  await fastify.close() // 🧹 Triggers onClose hooks!

  logShutdownMessage()

  process.exit(0)
}
