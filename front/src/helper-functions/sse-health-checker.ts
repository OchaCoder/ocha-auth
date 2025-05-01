import { z } from "@builder.io/qwik-city"
import { configPublic } from "../config-public"
import { type BackendHealth } from "../contexts/ContextGlobalState"

// Reply @SSE health check
const replySseHealthCheckSchema = z.object({
  success: z.boolean(),
  data: z.object({ stable: z.boolean(), initialCheck: z.boolean() }),
})

export const sseHealthChecker = (backendHealth: BackendHealth) => {
  const source = new EventSource(`${configPublic.BACKEND_URL}/health-events`)

  // Case 1: Health report came back
  source.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      const parsedReply = replySseHealthCheckSchema.parse(data)

      // Case 1-1: Fastify was down but it came back.
      if (backendHealth.fastifyDown) {
        backendHealth.suppressGreen = false
        backendHealth.stable = parsedReply.data.stable
        backendHealth.fastifyDown = false //  Reset Fastify's state.
      }
      // Case 1-2: Fastify has been stable.
      else {
        backendHealth.suppressGreen = parsedReply.data.initialCheck // If initialCheck is true, suppress green alert.
        backendHealth.stable = parsedReply.data.stable
      }
    } catch {
      // Case 1-3: Health report is unreliable (bad JSON or unexpected format).
      // Unlikely, but fallback to unstable
      backendHealth.stable = false
    }
  }

  // Case 2: Fastify is down. Health report has not arrived.
  source.onerror = () => {
    // SSE connection dropped — Fastify is likely down or restarting
    backendHealth.fastifyDown = true
    backendHealth.stable = false
  }
  return () => source.close()
}
