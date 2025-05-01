/**
 * Provides operation codes for all backend endpoints.
 *
 * This central object is used to resolve:
 * - backend route paths
 * - server input structure (used in `routeLoader$`, `routeAction$`, and `globalAction$`)
 * - schema mappings
 * - and more.
 *
 * `general.loader` is currently a placeholder, but may be useful for future static content loading (e.g., product listings).
 */
export const backendOpCode = {
  general: {
    loader: { LOAD_GENERAL___: "LOAD_GENERAL___" },
    action: {
      ACTION_GENERAL_AUTH_USER_REGISTER: "ACTION_GENERAL_AUTH_USER_REGISTER",
      ACTION_GENERAL_AUTH_USER_SIGN_IN: "ACTION_GENERAL_AUTH_USER_SIGN_IN",
      ACTION_GENERAL_AUTH_RESET_PASSWORD_PRE_EMAIL: "ACTION_GENERAL_AUTH_RESET_PASSWORD_PRE_EMAIL",
      ACTION_GENERAL_AUTH_RESET_PASSWORD_VERIFY_TOKEN: "ACTION_GENERAL_AUTH_RESET_PASSWORD_VERIFY_TOKEN",
      ACTION_GENERAL_AUTH_RESET_PASSWORD_POST_EMAIL: "ACTION_GENERAL_AUTH_RESET_PASSWORD_POST_EMAIL",
    },
  },
  protected: {
    loader: { LOAD_PROTECTED_USER_DASHBOARD: "LOAD_PROTECTED_USER_DASHBOARD", LOAD_PROTECTED_USER_EDIT: "LOAD_PROTECTED_USER_EDIT" },
    action: {
      ACTION_PROTECTED_USER_DELETE: "ACTION_PROTECTED_USER_DELETE",
      ACTION_PROTECTED_USER_UPDATE: "ACTION_PROTECTED_USER_UPDATE",
      ACTION_PROTECTED_USER_SIGN_OUT_FROM_ALL: "ACTION_PROTECTED_USER_SIGN_OUT_FROM_ALL",
      ACTION_PROTECTED_USER_SIGN_OUT_FROM_ONE: "ACTION_PROTECTED_USER_SIGN_OUT_FROM_ONE",
    },
  },
} as const

/**
 * Operation code for loading general static data.
 * (e.g., product list or non-authenticated content)
 *
 * Note: This route is currently unused, but defined for potential future expansion.
 */
export type GenralLoaderCode = typeof backendOpCode.general.loader.LOAD_GENERAL___

/**
 * Operation codes for loading protected user-related static data.
 */
export type ProtectedLoaderCode = typeof backendOpCode.protected.loader.LOAD_PROTECTED_USER_DASHBOARD | typeof backendOpCode.protected.loader.LOAD_PROTECTED_USER_EDIT

/**
 * Operation codes for general (non-authenticated) backend actions.
 */
export type GeneralActionCode =
  | typeof backendOpCode.general.action.ACTION_GENERAL_AUTH_USER_REGISTER
  | typeof backendOpCode.general.action.ACTION_GENERAL_AUTH_USER_SIGN_IN
  | typeof backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_PRE_EMAIL
  | typeof backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_VERIFY_TOKEN
  | typeof backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_POST_EMAIL

/**
 * Operation codes for authenticated (protected) backend actions.
 */
export type ProtectedActionCode =
  | typeof backendOpCode.protected.action.ACTION_PROTECTED_USER_DELETE
  | typeof backendOpCode.protected.action.ACTION_PROTECTED_USER_UPDATE
  | typeof backendOpCode.protected.action.ACTION_PROTECTED_USER_SIGN_OUT_FROM_ONE
  | typeof backendOpCode.protected.action.ACTION_PROTECTED_USER_SIGN_OUT_FROM_ALL

/**
 * A full union of all backend operation codes across loaders and actions.
 */
export type BackendOpCode = GenralLoaderCode | GeneralActionCode | ProtectedLoaderCode | ProtectedActionCode
