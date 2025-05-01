export class ErrorRedis extends Error {
  public readonly description: string

  constructor(originalError: Error & any, description: string = "") {
    super(originalError.message) // Set the message from the original

    this.name = "Error Redis"
    this.description = description

    // Copy over all enumerable properties from the original error
    Object.assign(this, originalError)

    // Maintains stack trace for where error was thrown (only in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorRedis)
    }
  }
}
