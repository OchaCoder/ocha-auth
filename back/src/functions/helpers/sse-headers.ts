import { FastifyReply, FastifyRequest } from "fastify"

/**
 * Sets the required headers for an SSE (Server-Sent Events) connection.
 * This function uses raw Node.js `.writeHead()` to ensure headers are applied
 * before the response starts streaming, bypassing Fastify's normal hooks.
 */

export const sseHeaders = (request: FastifyRequest, reply: FastifyReply) => {
  reply.raw.writeHead(200, {
    "Access-Control-Allow-Origin": "https://incomparable-marigold-3f81ff.netlify.app",
    "Content-Type": "text/event-stream", // Tell the browser we're sending a stream of events.
    "Cache-Control": "no-cache", // Disable caching — always send fresh updates.
    Connection: "keep-alive", // Keep the connection alive indefinitely.
  })
}
