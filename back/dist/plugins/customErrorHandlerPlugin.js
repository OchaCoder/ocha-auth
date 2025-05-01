import fp from "fastify-plugin";
import { ErrorPostgres } from "../error-classes/error-pg.js";
import { ErrorRedis } from "../error-classes/error-redis.js";
// Catches Errors inside Fastify routes, hooks, and middleware.
// Only works on errors from within Fastify’s request-response cycle.
export const customErrorHandlerPlugin = fp(async (fastify) => {
    fastify.setErrorHandler((err, request, reply) => {
        if (err instanceof ErrorPostgres) {
            return reply.status(500).send(false);
        }
        else if (err instanceof ErrorRedis) {
            return reply.status(500).send(false);
        }
        else {
            switch (err.message) {
                case "ERR_REDIS_UNAVAILABLE":
                    console.error("💥 [CAUSE] Redis couldn't respond.");
                    console.error("💥 [STACK TRACE]", err.stack || err);
                    reply.code(500).send({ code: "ERR_REDIS_UNAVAILABLE" });
                    break;
                case "ERR_FORM_NOT_FILLED":
                    reply.status(400).send({ code: "ERR_FORM_NOT_FILLED", message: "" });
                    break;
                default:
                    console.log("🧨🧨🧨", err.message);
                    reply.status(500).send({ code: err.message });
            }
            // Log the error
            console.error("🧨🧨🧨 Custom Error Handler:", err);
        }
    });
});
