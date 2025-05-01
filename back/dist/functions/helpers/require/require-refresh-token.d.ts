import { FastifyInstance } from "fastify";
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
export declare const requireRefreshToken: (fastify: FastifyInstance, browserId: string, userIdentifier: string) => Promise<string>;
