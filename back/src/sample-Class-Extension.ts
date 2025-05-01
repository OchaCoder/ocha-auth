class AppError extends Error {
  public readonly code: string // Custom error code
  public readonly statusCode: number // HTTP status code
  public readonly functionName: string // Where the error occurred
  public readonly originalError?: Error // Preserve original error (if any)

  constructor({ message, code, statusCode, functionName, originalError }: { message: string; code: string; statusCode: number; functionName: string; originalError?: Error }) {
    super(message)
    this.name = "AppError"
    this.code = code
    this.statusCode = statusCode
    this.functionName = functionName
    this.originalError = originalError

    // Capture the stack trace, excluding the constructor itself
    Error.captureStackTrace(this, this.constructor)
  }
}

// For manual error throwing
class MError extends Error {
  public readonly code: string
  public readonly functionName: string

  constructor({ message, code, functionName }: { message: string; code: string; functionName: string }) {
    super(message)
    this.name = "MError" // Custom error name
    this.code = code
    this.functionName = functionName
    this.stack = "" // No stack needed for manual errors
  }
}

// For wrapping node-pg errors
class PgError extends Error {
  public readonly details: string
  public readonly query: string
  public readonly originalError: Error

  constructor({ message, query, details, originalError }: { message: string; query: string; details: string; originalError: Error }) {
    super(message)
    this.name = "PgError"
    this.details = "create some detailed description using default error from node-pg!"
    this.query = query
    this.originalError = originalError
    Error.captureStackTrace(this, this.constructor) // Remove constructor clutter
  }
}

// For wrapping Argon2 errors
class ArgonError extends Error {
  public readonly hashConfig: object
  public readonly originalError: Error

  constructor({ message, hashConfig, originalError }: { message: string; hashConfig: object; originalError: Error }) {
    super(message)
    this.name = "ArgonError"
    this.hashConfig = hashConfig
    this.originalError = originalError
    Error.captureStackTrace(this, this.constructor)
  }
}

const err = new Error("bo")

// How to use them
throw new AppError({
  message: "Redis is unavailable.",
  code: "ERR_REDIS_UNAVAILABLE",
  statusCode: 500,
  functionName: "userRegister",
  originalError: err, // The caught error
})
