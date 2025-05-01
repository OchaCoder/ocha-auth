import { z } from "@builder.io/qwik-city"
import { backendOpCode, BackendOpCode } from "../backend-op-codes"

/**
 * Takes a code representing the backend operation,
 * and returns a full schema capable of validating entire server responses
 * from `routeLoader$`, `routeAction$`, or `globalAction$`.
 *
 * Server output falls into two categories:
 * 1. Success:
 *    { success: true, data: {...}, sideEffects: {...} }
 * 2. Error:
 *    { success: false, errorAction: { type: "...", message: "..." } }
 *
 * This resolver returns a Zod schema that can validate either form.
 * Use it in `rawReplyParser` to ensure that all route responses
 * match the expected structure.
 *
 * @param dataSchema - A Zod schema describing only the `data` portion of the raw reply.
 * @returns A complete Zod schema for the full route output object.
 */

export const completeServerOutputSchemaResolver = <C extends BackendOpCode>(code: C) => {
  /**
   * Maps a Zod schema that only represents the `data` portion of a backend operation's response.
   * */
  const dataOnlySchemaMap = {
    // For GENRAL static data loading (e.g. a product list)
    // - *There is none in the current scope of this project, but may be useful for future updates*
    [backendOpCode.general.loader.LOAD_GENERAL___]: z.literal(null),

    // For GENERAL backend operational action
    [backendOpCode.general.action.ACTION_GENERAL_AUTH_USER_REGISTER]: z.object({ userName: z.string() }),
    [backendOpCode.general.action.ACTION_GENERAL_AUTH_USER_SIGN_IN]: z.object({ userName: z.string() }),
    [backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_PRE_EMAIL]: z.literal(null),
    [backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_VERIFY_TOKEN]: z.object({ rpt: z.string(), obfuscatedEmail: z.string() }),
    [backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_POST_EMAIL]: z.literal(null),

    // For PROTECTED static data loading
    [backendOpCode.protected.loader.LOAD_PROTECTED_USER_DASHBOARD]: z.object({
      name: z.string(),
      email: z.string().email(),
      createdAt: z.string(),
      lastModifiedAt: z.string(),
    }),
    [backendOpCode.protected.loader.LOAD_PROTECTED_USER_EDIT]: z.object({ name: z.string(), email: z.string() }),

    // For PROTECTED operational action
    [backendOpCode.protected.action.ACTION_PROTECTED_USER_DELETE]: z.literal(null),
    [backendOpCode.protected.action.ACTION_PROTECTED_USER_UPDATE]: z.object({
      userData: z.object({
        name: z.object({
          updated: z.boolean(),
          oldValue: z.string(),
          newValue: z.string(),
        }),
        email: z.object({
          updated: z.boolean(),
          oldValue: z.string(),
          newValue: z.string(),
        }),
      }),
    }),
    [backendOpCode.protected.action.ACTION_PROTECTED_USER_SIGN_OUT_FROM_ALL]: z.literal(null),
    [backendOpCode.protected.action.ACTION_PROTECTED_USER_SIGN_OUT_FROM_ONE]: z.literal(null),
  }

  const dataSchema = dataOnlySchemaMap[code]

  return z.discriminatedUnion("success", [
    // success : true
    z.object({
      success: z.literal(true),
      data: dataSchema,
      sideEffects: z.object({
        cookie: z.discriminatedUnion("hasData", [
          z.object({
            hasData: z.literal(true),
            data: z.object({
              newBid: z.object({
                token: z.string(),
                maxAge: z.number(),
              }),
              newAt: z.object({
                token: z.string(),
                maxAge: z.number(),
              }),
            }),
          }),
          z.object({
            hasData: z.literal(false),
            data: z.literal(null),
          }),
        ]),
        devNotes: z.array(z.string()),
      }),
    }),
    // success : false
    z.object({
      success: z.literal(false),
      errorAction: z.object({
        type: z.enum(["red", "yellow", "green", "close"]),
        message: z.string(),
      }),
    }),
  ])
}
