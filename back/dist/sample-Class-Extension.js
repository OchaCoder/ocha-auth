class AppError extends Error {
    code; // Custom error code
    statusCode; // HTTP status code
    functionName; // Where the error occurred
    originalError; // Preserve original error (if any)
    constructor({ message, code, statusCode, functionName, originalError }) {
        super(message);
        this.name = "AppError";
        this.code = code;
        this.statusCode = statusCode;
        this.functionName = functionName;
        this.originalError = originalError;
        // Capture the stack trace, excluding the constructor itself
        Error.captureStackTrace(this, this.constructor);
    }
}
// For manual error throwing
class MError extends Error {
    code;
    functionName;
    constructor({ message, code, functionName }) {
        super(message);
        this.name = "MError"; // Custom error name
        this.code = code;
        this.functionName = functionName;
        this.stack = ""; // No stack needed for manual errors
    }
}
// For wrapping node-pg errors
class PgError extends Error {
    details;
    query;
    originalError;
    constructor({ message, query, details, originalError }) {
        super(message);
        this.name = "PgError";
        this.details = "create some detailed description using default error from node-pg!";
        this.query = query;
        this.originalError = originalError;
        Error.captureStackTrace(this, this.constructor); // Remove constructor clutter
    }
}
// For wrapping Argon2 errors
class ArgonError extends Error {
    hashConfig;
    originalError;
    constructor({ message, hashConfig, originalError }) {
        super(message);
        this.name = "ArgonError";
        this.hashConfig = hashConfig;
        this.originalError = originalError;
        Error.captureStackTrace(this, this.constructor);
    }
}
const err = new Error("bo");
// How to use them
throw new AppError({
    message: "Redis is unavailable.",
    code: "ERR_REDIS_UNAVAILABLE",
    statusCode: 500,
    functionName: "userRegister",
    originalError: err, // The caught error
});
export {};
