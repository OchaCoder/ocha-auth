/**
 * Validates the structural integrity of a browser ID (`bid`) used in secure session tracking.
 *
 * A valid browser ID:
 * - Must be a string
 * - Must not be empty
 * - Must be exactly 21 characters long
 * - Must contain only characters from the nanoid character set: [a-zA-Z0-9_-]
 *
 * This function protects against malformed or exploratory requests attempting to forge or
 * tamper with session identity via `bid`. Designed to be used early in access token refresh flows.
 *
 * ⚠️ Throws `ErrorSuspiciousActivity` on any violation to support logging, metrics, and alerting.
 *
 * @param browserId - The raw input value (usually from request body or cookie)
 * @param userIdentifier - A string representing the associated user or source (for logging context)
 * @returns The validated browser ID string
 */
export declare const validateBrowserId: (browserId: unknown, userIdentifier: string) => string;
