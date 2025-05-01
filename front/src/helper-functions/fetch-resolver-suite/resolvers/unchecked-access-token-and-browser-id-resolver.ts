import type { RequestEvent, RequestEventAction, RequestEventLoader } from "@builder.io/qwik-city"

/**
 *
 * Attempts to obtain both access token (`at`) and browser ID (`bid`) from the cookies, and returns them as are.
 *
 * The `undefined` case for both `at` and `bid` are left unchecked on purpose.
 *
 * @param ev
 *
 * @param code
 * @returns { at, bid } unless both of them are absent.
 *
 */
export const uncheckedAccessTokenAndBrowserIdResolver = (ev: RequestEventAction | RequestEventLoader | RequestEvent): { at: string | undefined; bid: string | undefined } => {
  const at = ev.cookie.get("at")?.value

  const bid = ev.cookie.get("bid")?.value

  if (!at && !bid) throw ev.redirect(302, "/session-expired")

  return { at, bid }
}
