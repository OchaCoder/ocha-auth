import type { RequestEvent, RequestEventAction, RequestEventLoader } from "@builder.io/qwik-city"
import { type BackendOpCode } from "./backend-op-codes"
import { CompleteBackendReplyValidator, type ServerOutputTypeMap } from "./map/reply-data-tb-schema"

/**
 * Parses the `rawData` object returned from route-specific fetch operations
 * such as `routeLoader`, `routeAction`, or `globalAction`.
 *
 * A generator is used to produce a validation schema tailored to the route. (See `routeSpecificSchemaGenerator`)
 *
 * `rawData` may fall into one of three categories:
 *
 * 1. A valid Fastify reply when the fetch succeeded.
 *    Example: { success: true, data: {...}, sideEffects: {...} }
 *
 * 2. A structured fallback error object generated in the catch block of loader/action
 *    when the fetch failed. (see `wretchErrorHandler`)
 *    Example: { success: false, type: "red", message: "..." }
 *
 * 3. A completely unknown value.
 *    This usually indicates a frontend bug, since even errors such as "Fastify down"
 *    are gracefully handled under normal conditions. See `wretchErrorHandler`.
 *
 * @param rawData - The result of a fetch operation (e.g., backend payload from action/loader).
 * @param dataSchema - A Zod schema used to define the expected shape of `success`, `data`, and `sideEffects`.
 * @param ev - The route event object (`RequestEventLoader` or `RequestEventAction`), required for invoking redirects.
 * @returns The validated reply object.
 */
export const rawReplyValidator = <C extends BackendOpCode>(rawData: unknown, code: C, ev: RequestEventLoader | RequestEventAction | RequestEvent) => {
  const Schema = CompleteBackendReplyValidator[code]

  if (Schema.Check(rawData)) return rawData as ServerOutputTypeMap[C]
  else {
    // This is a bug. Either the backend is not replying with expected shape, or the schema is wrong.
    throw ev.redirect(302, "/oops")
  }
}
