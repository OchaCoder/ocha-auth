import { FormatRegistry, type TSchema, Type, type Static } from "@sinclair/typebox"
import { type TypeCheck, TypeCompiler } from "@sinclair/typebox/compiler"
import { backendOpCode } from "../backend-op-codes"

// Register the email format
FormatRegistry.Set("email", (value) => {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
})

// Basic schema of complete backend reply
const ShellSchema = <T extends TSchema>(dataSchema: T) =>
  Type.Union([
    Type.Object({
      success: Type.Literal(true),
      data: dataSchema,
      sideEffects: Type.Object({
        cookie: Type.Union([
          Type.Object({
            hasData: Type.Literal(true),
            data: Type.Object({
              newBid: Type.Object({
                token: Type.String(),
                maxAge: Type.Number(),
              }),
              newAt: Type.Object({
                token: Type.String(),
                maxAge: Type.Number(),
              }),
            }),
          }),
          Type.Object({
            hasData: Type.Literal(false),
            data: Type.Null(),
          }),
        ]),
        devNotes: Type.Array(Type.String()),
      }),
    }),
    Type.Object({
      success: Type.Literal(false),
      errorAction: Type.Object({
        type: Type.Union([Type.Literal("red"), Type.Literal("yellow"), Type.Literal("green"), Type.Literal("close")]),
        message: Type.String(),
      }),
    }),
  ])

const CompleteSchema = {
  general: {
    loader: {
      ___: ShellSchema(Type.Null()), // - *There is none in the current scope of this project, but may be useful for future updates*
    },
    action: {
      authUserRegister: ShellSchema(Type.Object({ userName: Type.String() })),
      authUserSignin: ShellSchema(Type.Object({ userName: Type.String() })),
      authResetPasswordPreEmail: ShellSchema(Type.Null()),
      authResetPasswordVerifyToken: ShellSchema(Type.Object({ rpt: Type.String(), obfuscatedEmail: Type.String() })),
      authResetPasswordPostEmail: ShellSchema(Type.Null()),
    },
  },
  protected: {
    loader: {
      userDashboard: ShellSchema(Type.Object({ name: Type.String(), email: Type.String({ format: "email" }), createdAt: Type.String(), lastModifiedAt: Type.String() })),
      userEdit: ShellSchema(Type.Object({ name: Type.String(), email: Type.String({ format: "email" }) })),
    },
    action: {
      userDelete: ShellSchema(Type.Null()),
      userUpdate: ShellSchema(
        Type.Object({
          userData: Type.Object({
            name: Type.Object({ updated: Type.Boolean(), oldValue: Type.String(), newValue: Type.String() }),
            email: Type.Object({ updated: Type.Boolean(), oldValue: Type.String(), newValue: Type.String() }),
          }),
        })
      ),
      userSignOutFromAll: ShellSchema(Type.Null()),
      userSignOutFromOne: ShellSchema(Type.Null()),
    },
  },
}

export type ServerOutputTypeMap = {
  [backendOpCode.general.loader.LOAD_GENERAL___]: Static<typeof CompleteSchema.general.loader.___>

  [backendOpCode.general.action.ACTION_GENERAL_AUTH_USER_REGISTER]: Static<typeof CompleteSchema.general.action.authUserRegister>
  [backendOpCode.general.action.ACTION_GENERAL_AUTH_USER_SIGN_IN]: Static<typeof CompleteSchema.general.action.authUserSignin>
  [backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_PRE_EMAIL]: Static<typeof CompleteSchema.general.action.authResetPasswordPreEmail>
  [backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_VERIFY_TOKEN]: Static<typeof CompleteSchema.general.action.authResetPasswordVerifyToken>
  [backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_POST_EMAIL]: Static<typeof CompleteSchema.general.action.authResetPasswordPostEmail>

  [backendOpCode.protected.loader.LOAD_PROTECTED_USER_DASHBOARD]: Static<typeof CompleteSchema.protected.loader.userDashboard>
  [backendOpCode.protected.loader.LOAD_PROTECTED_USER_EDIT]: Static<typeof CompleteSchema.protected.loader.userEdit>

  [backendOpCode.protected.action.ACTION_PROTECTED_USER_DELETE]: Static<typeof CompleteSchema.protected.action.userDelete>
  [backendOpCode.protected.action.ACTION_PROTECTED_USER_UPDATE]: Static<typeof CompleteSchema.protected.action.userUpdate>
  [backendOpCode.protected.action.ACTION_PROTECTED_USER_SIGN_OUT_FROM_ALL]: Static<typeof CompleteSchema.protected.action.userSignOutFromAll>
  [backendOpCode.protected.action.ACTION_PROTECTED_USER_SIGN_OUT_FROM_ONE]: Static<typeof CompleteSchema.protected.action.userSignOutFromOne>
}

const compile = <T extends TSchema>(schema: T): TypeCheck<T> => TypeCompiler.Compile(schema)

/**
 * Takes a code representing the backend operation,
 * and returns a full validator capable of validating the full shape of the server responses
 * from `routeLoader$`, `routeAction$`, or `globalAction$`.
 *
 * Server output falls into two categories:
 * 1. Success:
 *    { success: true, data: {...}, sideEffects: {...} }
 * 2. Error:
 *    { success: false, errorAction: { type: "...", message: "..." } }
 *
 * Returns a TypeBox Validator that can validate either form.
 * Use it in `rawReplyParser` to ensure that all route responses
 * match the expected structure.
 *
 * @returns A complete TypeBox validator for the full route output object.
 * */
export const CompleteBackendReplyValidator = {
  // For GENRAL static data loading (e.g. a product list)
  // - *There is none in the current scope of this project, but may be useful for future updates*
  [backendOpCode.general.loader.LOAD_GENERAL___]: compile(CompleteSchema.general.loader.___),

  // For GENERAL backend operational action
  [backendOpCode.general.action.ACTION_GENERAL_AUTH_USER_REGISTER]: compile(CompleteSchema.general.action.authUserRegister),
  [backendOpCode.general.action.ACTION_GENERAL_AUTH_USER_SIGN_IN]: compile(CompleteSchema.general.action.authUserSignin),
  [backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_PRE_EMAIL]: compile(CompleteSchema.general.action.authResetPasswordPreEmail),
  [backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_VERIFY_TOKEN]: compile(CompleteSchema.general.action.authResetPasswordVerifyToken),
  [backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_POST_EMAIL]: compile(CompleteSchema.general.action.authResetPasswordPostEmail),

  // For PROTECTED static data loading
  [backendOpCode.protected.loader.LOAD_PROTECTED_USER_DASHBOARD]: compile(CompleteSchema.protected.loader.userDashboard),
  [backendOpCode.protected.loader.LOAD_PROTECTED_USER_EDIT]: compile(CompleteSchema.protected.loader.userEdit),

  // For PROTECTED operational action
  [backendOpCode.protected.action.ACTION_PROTECTED_USER_DELETE]: compile(CompleteSchema.protected.action.userDelete),
  [backendOpCode.protected.action.ACTION_PROTECTED_USER_UPDATE]: compile(CompleteSchema.protected.action.userUpdate),
  [backendOpCode.protected.action.ACTION_PROTECTED_USER_SIGN_OUT_FROM_ALL]: compile(CompleteSchema.protected.action.userSignOutFromAll),
  [backendOpCode.protected.action.ACTION_PROTECTED_USER_SIGN_OUT_FROM_ONE]: compile(CompleteSchema.protected.action.userSignOutFromOne),
}

CompleteBackendReplyValidator[backendOpCode.general.loader.LOAD_GENERAL___]
