import { FastifyReply } from "fastify";
/**
 * Verifies a Paseto V4 token and handles expiration or tampering gracefully.
 *
 * - Returns the decrypted token object if valid
 * - Sends a soft fail (500 response) if token is expired in acceptable cases (like RPT)
 * - Throws `ErrorSuspiciousActivity` or `ErrorDefensiveGuardBreach` for other violations
 */
export declare const verifyPasetoV4: (reply: FastifyReply, v4Token: string, key: string, userIdentifier: string, tokenName: "at" | "rt" | "rpt" | "rptUserObj") => Promise<Record<string, unknown>>;
