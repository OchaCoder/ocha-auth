import { ProtectedRequest } from "../../../type.js";
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
export declare const requireUserId: (request: ProtectedRequest) => number;
