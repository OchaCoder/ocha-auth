import { runRedis } from "../run-redis/index.js";
import { ErrorSuspiciousActivity } from "../../../error-classes/error-suspicious-activity.js";
/**
 * Retrieves the refresh token (RT) associated with a given browser ID from Redis.
 *
 * Typically used during access token refresh flows, where the browser ID (`bid`)
 * is stored in a secure cookie and used to look up the corresponding RT.
 *
 * This helper assumes the RT and cookie lifetimes are reasonably in sync.
 * See `generateStaggeredExpiration` for TTL alignment strategy.
 *
 * ⚠️ Unless the frontend cookie is misconfigured, a missing RT for a provided browser ID may indicate:
 * - Exploratory or malicious reuse of expired or forged browser IDs
 * - Manual cookie manipulation by the user
 *
 * This implementation treats such cases as suspicious activity.
 *
 * @throws ErrorSuspiciousActivity if no RT is found for the provided browser ID
 * @returns The raw refresh token string from Redis
 */
export const requireRefreshToken = async (fastify, browserId, userIdentifier) => {
    // 1. Get refresh token from Redis using browser ID
    const rawRefreshToken = await runRedis.get.str(fastify, `browserID:${browserId}`, userIdentifier);
    // 2. We use `generateStaggeredExpiration()` to ensure the TTLs of the browser ID cookie and Redis are closely aligned.
    // Assuming the frontend respects the TTLs returned by the backend,
    // a valid browser ID should always be accompanied by a valid refresh token in Redis.
    //
    // If the refresh token is missing despite a valid-looking browser ID, it may indicate:
    // - frontend misconfiguration
    // - stale or forged client state
    // - malicious token probing
    if (!rawRefreshToken)
        throw new ErrorSuspiciousActivity("ERR_MISSING_RT_FOR_VALID_BID", "The request contained a valid-looking browser ID, but no matching refresh token was found in Redis. This may indicate tampering or cookie misconfiguration in the frontend.", { identity: userIdentifier }, {
            specialJson: JSON.stringify({ browserId }),
            debug: { bid: browserId },
        });
    return rawRefreshToken;
};
