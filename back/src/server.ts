import Fastify from "fastify"

import { config } from "./config.js"

// Create fastify instance
const fastify = Fastify()

fastify.get("/test", (request, reply) => reply.status(200).send("The request is received!"))

// Start the server
const startServer = async () => {
  try {
    fastify.listen({ port: config.PORT })
    await fastify.ready()

    console.log("Server is listening.")
  } catch (err) {
    console.error("💥Server failed to start:", err)
    process.exit(1)
  }
}

startServer()
