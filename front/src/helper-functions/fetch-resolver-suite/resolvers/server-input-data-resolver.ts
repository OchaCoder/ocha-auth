import { backendOpCode, GeneralActionCode, ProtectedActionCode, ProtectedLoaderCode } from "../backend-op-codes"

// Function overload

// Request with a `payloadData` is always either `routeAction$` or `globalAction$`, but the opposite is not true.
export function serverInputDataResolver<C extends GeneralActionCode | ProtectedActionCode, D>(code: C, payloadData: D): { code: C; payload: { hasData: true; data: D } }

// If the incoming code was `GeneralActionCode` and didn't have the `payloadData`,
// type the code in return as `GeneralActionCode`.
export function serverInputDataResolver<C extends GeneralActionCode>(code: C): { code: C; payload: { hasData: false; data: null } }

// If the incoming code was `ProtectedActionCode | ProtectedLoaderCode` and didn't have the `payloadData`,
// type the code in return as `ProtectedActionCode | ProtectedLoaderCode`.
export function serverInputDataResolver<C extends ProtectedActionCode | ProtectedLoaderCode>(code: C): { code: C; payload: { hasData: false; data: null } }

/**
 *
 * This resolver takes a code representing a specific backend operation and data,
 * and returns a input data shape expected by `routeAction$` or `globalAction$`.
 * @param code
 *
 * @param payloadData
 * @returns
 */
export function serverInputDataResolver(code: unknown, payloadData?: unknown) {
  switch (code) {
    case backendOpCode.general.action.ACTION_GENERAL_AUTH_USER_REGISTER:

    case backendOpCode.general.action.ACTION_GENERAL_AUTH_USER_SIGN_IN:
    case backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_PRE_EMAIL:
    case backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_VERIFY_TOKEN:
    case backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_POST_EMAIL:
    case backendOpCode.protected.action.ACTION_PROTECTED_USER_UPDATE:
    case backendOpCode.protected.action.ACTION_PROTECTED_USER_SIGN_OUT_FROM_ONE:
      return { code, payload: { hasData: true, data: payloadData } }

    case backendOpCode.protected.loader.LOAD_PROTECTED_USER_DASHBOARD:
    case backendOpCode.protected.loader.LOAD_PROTECTED_USER_EDIT:
    case backendOpCode.protected.action.ACTION_PROTECTED_USER_DELETE:
    case backendOpCode.protected.action.ACTION_PROTECTED_USER_SIGN_OUT_FROM_ALL:
    default:
      return { code, payload: { hasData: false, data: null } }
  }
}
