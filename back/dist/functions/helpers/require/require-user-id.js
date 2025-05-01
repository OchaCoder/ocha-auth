import { ErrorDefensiveGuardBreach } from "../../../error-classes/error-defensive-guard-breach.js";
import { ErrorSuspiciousActivity } from "../../../error-classes/error-suspicious-activity.js";
/**
 * Ensures a valid `user.id` is present on the Fastify request object.
 *
 * This helper is used in protected routes where authentication middleware
 * is expected to have attached a valid user object to the request.
 *
 * If the entire `user` object is missing, it's considered a defensive breach
 * — likely due to misconfigured or missing authentication middleware.
 *
 * If the `user` object exists but lacks a valid `id`, it is treated as suspicious activity
 * — possibly due to tampering or bypass attempts.
 *
 * @throws ErrorDefensiveGuardBreach – When the `user` object is missing entirely.
 * @throws ErrorSuspiciousActivity – When `user` exists but lacks a valid `id`.
 * @returns The validated numeric user ID.
 */
export const requireUserId = (request) => {
    const { user } = request;
    // Case 1: Whole user object is missing
    if (!user)
        throw new ErrorDefensiveGuardBreach("ERR_USER_NOT_FOUND_IN_REQUEST_BODY", "Expected user object from middleware, but none was found. Likely a bug in middleware auth plugin.");
    // Case 2: User object is present, but it's malformed or tampered
    if (!user.id)
        throw new ErrorSuspiciousActivity("ERR_MALFORMED_USER_OBJECT", "User object present but missing a valid ID. This indicates possible object tampering or a bug in auth middleware.", {
            identity: "unknown",
        });
    return user.id;
};
