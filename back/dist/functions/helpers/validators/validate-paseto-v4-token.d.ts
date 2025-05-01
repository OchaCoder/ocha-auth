/**
 * Performs a lightweight structural check to ensure the given value appears to be
 * a Paseto v4 public token (`v4.public.`).
 *
 * This is your first line of defense against malformed, exploratory, or tampered requests.
 * It should be used before performing costly cryptographic verification via `V4.verify()`.
 *
 * Common use cases:
 * - Middleware or protected route guards
 * - Early rejection of invalid tokens
 * - Logging and alerting suspicious activity
 *
 * Throws `ErrorSuspiciousActivity` if the token does not match the expected format.
 *
 * @param v4Token - The raw Paseto token string
 * @param userIdentifier - A user identifier used for context in logging or alerting
 * @returns The same token, if valid
 */
export declare const validatePasetoV4Token: (v4Token: unknown, userIdentifier: string) => string;
