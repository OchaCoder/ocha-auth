import { FastifyReply, FastifyRequest } from "fastify";
/**
 * Sets the required headers for an SSE (Server-Sent Events) connection.
 * This function uses raw Node.js `.writeHead()` to ensure headers are applied
 * before the response starts streaming, bypassing Fastify's normal hooks.
 */
export declare const sseHeaders: (request: FastifyRequest, reply: FastifyReply) => void;
