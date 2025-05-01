import type { RequestEvent, RequestEventAction, RequestEventLoader } from "@builder.io/qwik-city"
import { WretchError } from "wretch/resolver"

// Useful schema for the object that this helper returns.
// export const errorSchema = z.object({
//   success: z.boolean(),
//   errorAction: z.object({
//     type: z.enum(["red", "yellow", "green"]),
//     message: z.string(),
//   }),
// })

/**
 * Handles errors thrown during `wretch` fetch operations.
 * Converts backend error codes into frontend-friendly redirection or toast messages.
 *
 * In critical cases, redirects the user (e.g., possible bug, suspicious activity).
 * For expected recoverable errors, returns a soft error object to show toast notifications.
 *
 * @param err - The error object caught during a fetch.
 * @param ev - The Qwik route event (used to trigger redirects when needed).
 * @returns A soft error response for UI feedback, or throws a redirect.
 */
export const wretchErrorHandler = (err: unknown, ev: RequestEventAction | RequestEventLoader | RequestEvent) => {
  if (err instanceof WretchError) {
    // Fastify is down
    if (err.json.message === "Service Unavailable") {
      return { success: false, errorAction: { type: "red", message: "Connection is unstable. Please try again later." } }
    }
    switch (err.json.code) {
      // Health chek triggered this
      case "ERR_SYSTEM_FAILURE":
        return { success: false, errorAction: { type: "red", message: "Connection is unstable. Please try again later." } }

      // User tried to register with an existing email.
      case "ERR_EMAIL_ALREADY_EXISTS":
        return { success: false, errorAction: { type: "yellow", message: "This email is already registered with us." } }

      // Sign in attempt not successful
      case "ERR_UNREGISTERED_SIGNIN_REQUEST":
      case "ERR_PASSWORD_NOT_MATCHING":
        return { success: false, errorAction: { type: "yellow", message: "We couldn't sign you in. Please check your email or password." } }

      // Resend.com is down. Notice the user about system failure.
      case "ERR_EMAIL_SEND_FAILED":
        throw ev.redirect(303, "/reset/request/could-not-send/")

      // Password reset request was made, but the submitted email was not registerd.
      // Success or error, we redirect the user to the same path for security.
      case "ERR_PASS_RESET_REQUEST_W_UNREGISTERED_EMAIL":
        throw ev.redirect(303, "/reset/request/complete/")

      // Password reset link is expired.
      case "ERR_RPT_EXPIRED":
      case "ERR_RPT_NOT_FOUND":
        throw ev.redirect(303, "/reset/link-expired/")

      // Password reset link is already used.
      case "ERR_RPT_IS_USED":
        throw ev.redirect(303, "/reset/link-used/")

      // For Status code 400
      case "ERR_SUSPICIOUS_ACTIVITTY":
      case "ERR_UNKNOWN":
        throw ev.redirect(302, "/hmm")

      // For Status code 500
      case "ERR_DEFENSIVE_GUARD_BREACH":
      default:
        throw ev.redirect(302, "/oops")
    }
  }
}
