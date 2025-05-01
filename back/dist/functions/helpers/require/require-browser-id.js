import { validateBrowserId } from "../validators/validate-browser-id.js";
/**
 * Extracts and validates a browser ID (`bid`) from the request body.
 *
 * This helper is resilient to any input. However, it is strongly recommended to pair this
 * with a route-level schema that guarantees `bid: string` in the request payload.
 * This ensures early rejection of malformed requests and avoids relying solely on runtime validation.
 *
 * ## Contexts of Use
 * In your system, `bid` serves two main purposes:
 *
 * 1. Redis RT Lookup— Used to fetch the refresh token (`rt`) from Redis (e.g. during AT refresh).
 *    In this context, `bid` is usually extracted directly via schema typing — e.g.:
 *
 *    ```
 *    const { bid } = request.body as UserRefreshAT
 *    const userId = await resolveUserIdFromBrowserId(fastify, reply, bid)
 *    ```
 *    Because of this natural extraction, inserting `requireBrowserId()` here would feel redundant.
 *
 * 2. Browser Session Management — Used to remove or track a `bid` from Redis sets (e.g. during sign-out).
 *    In this context, `requireBrowserId()` shines as a single-step helper to extract + validate `bid`.
 *
 * While this helper is flexible for either case, it is most useful in context 2.
 * It helps keep route logic clean and removes boilerplate `typeof` or format validation checks.
 *
 * @param request - Fastify request with body containing the `bid` field
 * @param userIdentifier - Helpful identifier for structured error logging
 * @returns A validated browser ID string
 */
export const requireBrowserId = (request, userIdentifier) => {
    // 1. Assume schema guarantees presence of bid:string
    const { bid } = request.body;
    // 2. Run format validation (length, characters, etc.)
    const validatedBrowserId = validateBrowserId(bid, userIdentifier);
    // Return the validated `bid`
    return validatedBrowserId;
};
