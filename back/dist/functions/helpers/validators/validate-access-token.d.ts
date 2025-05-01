/**
 * Performs a lightweight structural check to ensure the access token appears to be
 * a Paseto v4 public token (`v4.public.`). This is the first line of defense against
 * malformed, exploratory, or tampered requests.
 *
 * This should be used **before** invoking expensive cryptographic verification via `V4.verify()`.
 *
 * Use this helper in middleware or protected routes to:
 * - Block clearly invalid tokens early
 * - Flag suspicious activity for logging or alerting
 *
 * Throws `ErrorSuspiciousActivity` if the token does not match the expected format.
 *
 * @param accessToken - The raw access token received from the request
 * @param userIdentity - Useful string used to help identify the actor in logs
 * @returns The same token, if valid
 */
export declare const validateAccessToken: (accessToken: string, userIdentity: string) => string;
