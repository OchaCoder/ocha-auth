import Fastify from "fastify"
import fastifyCors from "@fastify/cors"
import { config } from "./config.js"

// Create fastify instance
const fastify = Fastify()

//Register CORS
fastify.register(fastifyCors, {
  origin: true, // only if cookies is used.
})

fastify.get("/test", (request, reply) => reply.status(200).send("The request is received!"))

// Start the server
const startServer = async () => {
  try {
    fastify.listen({ port: config.PORT })
    await fastify.ready()

    console.log(`Fastify is listening on port ${config.PORT}`)
  } catch (err) {
    console.error("💥Server failed to start:", err)
    process.exit(1)
  }
}

startServer()
