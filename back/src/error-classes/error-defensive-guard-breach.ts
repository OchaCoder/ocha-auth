import { extractFilepathFromStack } from "../functions/helpers/extract-filepath-from-stack.js"

/**
 * This class is meant to catch impossible scenarios during runtime,
 * and provide observable and traceable assertion.
 * Its goal is not to improve UX by triggering frontend actions,
 * but to alert the developer that something has gone fundamentally wrong,
 * suggesting a possible bug scenario.
 */
export class ErrorDefensiveGuardBreach extends Error {
  public readonly code: string
  public readonly context: {
    file?: string
    functionName?: string
    specialJson?: string // <- for CLI logs / printable, human-readable payload for logs
    debug?: unknown // <- raw structured debug info for dashboards + deep tracing
  }
  public readonly timestamp: Date

  constructor(
    code: string = "ERR_DEFENSIVE_GUARD_BREACH",
    message: string = "",
    context: {
      file?: string
      functionName?: string
      specialJson?: string
      debug?: unknown
    } = {}
  ) {
    super(message)
    this.name = "Error Defensive Guard Breached"
    this.code = code
    this.context = { ...extractFilepathFromStack(new Error().stack), ...context }
    this.timestamp = new Date()

    // Excludes the constructor function and maintains clean stack trace
    // for where error was thrown (only in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorDefensiveGuardBreach)
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
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      // Optional: include stack if you want full trace in logs
      // stack: this.stack,
    }
  }
}
