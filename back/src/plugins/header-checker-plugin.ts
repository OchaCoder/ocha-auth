import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import fp from "fastify-plugin"
import { ErrorSuspiciousActivity } from "../error-classes/error-suspicious-activity.js"
/**
 * Checks incoming headers for a certain key and value to only let
 * requests through that pass the test.
 */
export const headerCheckerPlugin = fp(async (fastify: FastifyInstance) => {
  fastify.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
    // Gather potential attacker information.
    const userAgent = request.headers["user-agent"]
    const ip = request.ip

    // Explicitly skip the header check for the public SSE connection.
    if (request.url === "/health-events") return

    // Here, a hardcoded token is used on purpose simply to demonstrate
    // a lightweight header-based protection approach.
    //
    // A more serious setup may implement automatic token rotation involving Redis or Postgres,
    // although this would introduce additional complexity and dependencies.
    //
    // A possible middle-ground approach could be the clever use of a predefined static
    // set of tokens, resembling a "pseudo-random pre-rotation" or "deterministic shared-state rotation" model.
    //
    // Additionally, if the backend and frontend are deployed on the same server,
    // one could employ an "allow-only-localhost" approach based on the Zero Trust model,
    // which can be much simpler and more reliable than header-token strategies by design.

    // Demo only — production would use dynamic tokens or localhost restrictions.
    const notSoSecureStaticHeaderToken = "3bQdY1mE3agwuYqelMyjoS3GDaTY6iTtpxmg"
    const incomingToken = request.headers["gatekeeper"] as string | undefined

    if (!incomingToken || incomingToken !== notSoSecureStaticHeaderToken) {
      // Further improvements could include rate limiting by IP, blacklisting, real-time logging to external services, etc.
      throw new ErrorSuspiciousActivity("HEADER_NOT_MATCHING", "Missing or invalid special header. Likely a malicious direct access trial.", {
        ip,
        userAgent,
      })
    } else return
  })
})
