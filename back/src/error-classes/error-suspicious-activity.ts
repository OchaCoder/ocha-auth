import { extractFilepathFromStack } from "../functions/helpers/extract-filepath-from-stack.js"

/**
 * This class gives special attention to suspicious user behavior,
 * providing semantically clear communication within the codebase,
 * and ensuring future extensibility—such as integration
 * with Prometheus/Grafana or WAF (Web Application Firewall) logs—
 * by serving as a convenient adapter layer.
 *
 * It can also be used as a centralized audit and
 * tracing layer to describe suspicious user activity.
 *
 * @property {string} code - Custom application-level error code.
 * @property {string} [description] - Optional human-readable description for logs or future developers.
 * @property {SuspiciousActorInfo} [actorInfo] - Optional details about the user, device, or request source.
 */
export class ErrorSuspiciousActivity extends Error {
  public readonly code: string
  public readonly suspiciousActor: {
    ip?: string
    userAgent?: string
    browserId?: string // Technically browser ID; commonly called device ID in web auth.
    identity?: string // userID, email, etc.
    geoLocation?: {
      country?: string
      city?: string
      region?: string
      // Some services such as MaxMind (via IP) provide lat/lon.
      lat?: number // latitude
      lon?: number // longitude
    }
  }
  public readonly context: {
    file?: string
    functionName?: string
    specialJson?: string
    debug?: unknown
  }
  public readonly timestamp: Date

  constructor(
    code: string = "ERR_SUSPICIOUS_ACTIVITY",
    message: string = "",
    suspiciousActor: {
      ip?: string
      userAgent?: string
      browserId?: string // Technically browser ID; commonly called device ID in web auth.
      identity?: string // userID, email, etc.
      geoLocation?: {
        country?: string
        city?: string
        region?: string
        // Some services such as MaxMind (via IP) provide lat/lon.
        lat?: number // latitude
        lon?: number // longitude
      }
    } = {},
    context: {
      file?: string
      functionName?: string
      specialJson?: string
      debug?: unknown
    } = {}
  ) {
    super(message)

    this.name = "Error Suspicious Activity" // Helpful when logging.
    this.code = code
    this.suspiciousActor = suspiciousActor
    this.context = { ...extractFilepathFromStack(new Error().stack), ...context }
    this.timestamp = new Date()

    // Excludes the constructor function and maintains clean stack trace
    // for where error was thrown (only in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorSuspiciousActivity)
    }
  }
  /**
   * Prepares a clean JSON version of the error for logging or storage.
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      suspiciousActor: this.suspiciousActor,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      // Optional: include stack if you want full trace in logs
      // stack: this.stack,
    }
  }
}
