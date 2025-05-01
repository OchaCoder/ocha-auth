import { V4 } from "paseto";
import { ErrorSuspiciousActivity } from "../../../error-classes/error-suspicious-activity.js";
import { ErrorDefensiveGuardBreach } from "../../../error-classes/error-defensive-guard-breach.js";
/**
 * Verifies a Paseto V4 token and handles expiration or tampering gracefully.
 *
 * - Returns the decrypted token object if valid
 * - Sends a soft fail (500 response) if token is expired in acceptable cases (like RPT)
 * - Throws `ErrorSuspiciousActivity` or `ErrorDefensiveGuardBreach` for other violations
 */
export const verifyPasetoV4 = async (reply, v4Token, key, userIdentifier, tokenName) => {
    try {
        const decryptedV4Obj = await V4.verify(v4Token, key);
        return decryptedV4Obj;
    }
    catch (err) {
        // There are 7 known errors that Paseto could throw during runtime.
        // Here, 5 are covered explicitly.
        // Other 2 errors are `TypeError` and `PasetoError` which is the base error others inherit from.
        switch (err.code) {
            case "ERR_PASETO_CLAIM_INVALID": // One of the claims (e.g. exp) is invalid
                // ⚠️ Handle expiration differently depending on token type
                // ▶ RPT (Reset Password Token)
                // RPT is not backed by cookies or Redis — sent via email.
                // The only thing needed to trigger expiration is user delay.
                // Expiration is considered normal here, not suspicious.
                if (tokenName === "rpt") {
                    return reply.status(401).send({ success: false, code: "ERR_RPT_EXPIRED" });
                }
                // ▶ AT (Access Token)
                // AT derives from a cookie. The cookie and token have staggered TTLs to ensure
                // the cookie expires first (see `generateStaggeredExpiration`).
                // This makes the case appear 'slightely suspicious' (exploratory or tampering) while
                // the frontend cookie's misconfiguration cannot be ruled out completely.
                else if (tokenName === "at") {
                    throw new ErrorSuspiciousActivity("ERR_AT_COOKIE_PRESENT_BUT_V4_EXPIRED", "Despite present in cookie, access token was expired. Unless the frontend cookie is misconfigured, this may indicate exploratory or tampering.", { identity: userIdentifier });
                }
                // ▶ RT (Refresh Token)
                // The refresh token (RT) is:
                // - never exposed to the frontend
                // - stored in Redis
                // - keyed by a browser ID (BID)
                // making it difficult for an attacker to access.
                // A valid RT implies a legitimate BID, ruling out cookie tampering.
                // Since RT is only used within route handler logic, which is typically beyond an attacker’s reach,
                // an expired RT likely indicates a misconfiguration during token generation rather than malicious activity.
                // Which is why this case triggers an `ErrorDefensiveGuardBreach` instead of `ErrorSuspiciousActivity`.
                else if (tokenName === "rt") {
                    throw new ErrorDefensiveGuardBreach("ERR_RT_COOKIE_PRESENT_BUT_V4_EXPIRED", "Despite browser ID was present in cookie and refresh token was available in Redis, refresh token was expired. Possibly bug during token generation", { specialJson: JSON.stringify({ v4Token }), debug: { rt: v4Token } });
                }
                else if (tokenName === "rptUserObj") {
                    throw new ErrorDefensiveGuardBreach("ERR_RPT_USER_OBJ_EXPIRED_EARLIER_THAN_RPT_OR_REDIS", "This is the user object stored in Redis as V4 string. The Redis and its key which also derives from V4, are all set to expire in staggered timing (0, +10, +15 secs), so this case is normally impossible. Possibly bug during token generation", { specialJson: JSON.stringify({ v4Token }), debug: { rt: v4Token } });
                }
            // ▶ Other Paseto Errors (Tampering / Malformed / Forged)
            case "ERR_PASETO_INVALID": //General validation failed
            case "ERR_PASETO_NOT_SUPPORTED": // Unsupported version or purpose
            case "ERR_PASETO_DECRYPTION_FAILED": // Couldn’t decrypt token
            case "ERR_PASETO_VERIFICATION_FAILED": // Signature mismatch
                throw new ErrorSuspiciousActivity("ERR_INVALID_PASETO", "Paseto token was invalid. Possibly exploratory or tampering.", { identity: userIdentifier });
            // ▶ Fallback — unknown edge-case Paseto error
            default:
                // Invalid, forged, malformed token should be already caught by above cases.
                // This default case is here to make sure any edge case is caught.
                throw new ErrorSuspiciousActivity("ERR_UNKNOWN_PASETO_ERROR", "Unexpected Paseto error. Possibly malformed or forged.", { identity: userIdentifier });
        }
    }
};
