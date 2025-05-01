import { backendOpCode, BackendOpCode } from "../backend-op-codes"

const backendPathMap: Readonly<Record<BackendOpCode, string>> = {
  // For loading GENRAL staic data (e.g. a product list)
  // - *There is none in the current scope of this project, but may be useful for future updates*
  [backendOpCode.general.loader.LOAD_GENERAL___]: "",

  // For GENERAL backend operational action
  [backendOpCode.general.action.ACTION_GENERAL_AUTH_USER_REGISTER]: "/general/auth/user-register",
  [backendOpCode.general.action.ACTION_GENERAL_AUTH_USER_SIGN_IN]: "/general/auth/user-signin",
  [backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_PRE_EMAIL]: "/general/auth/reset-password/pre-email",
  [backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_VERIFY_TOKEN]: "/general/auth/reset-password/verify-token",
  [backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_POST_EMAIL]: "/general/auth/reset-password/post-email",

  // For loading PROTECTED static data
  [backendOpCode.protected.loader.LOAD_PROTECTED_USER_DASHBOARD]: "/protected/load/dashboard",
  [backendOpCode.protected.loader.LOAD_PROTECTED_USER_EDIT]: "/protected/load/edit",

  // For PROTECTED operational action
  [backendOpCode.protected.action.ACTION_PROTECTED_USER_DELETE]: "/protected/action/delete",
  [backendOpCode.protected.action.ACTION_PROTECTED_USER_UPDATE]: "/protected/action/update",
  [backendOpCode.protected.action.ACTION_PROTECTED_USER_SIGN_OUT_FROM_ONE]: "/protected/action/sign-out-from-one",
  [backendOpCode.protected.action.ACTION_PROTECTED_USER_SIGN_OUT_FROM_ALL]: "/protected/action/sign-out-from-all",
}

export const backendPathResolver = (code: BackendOpCode) => {
  return backendPathMap[code]
}
