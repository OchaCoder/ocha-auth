import type { RequestEvent, RequestEventAction, RequestEventLoader } from "@builder.io/qwik-city"

/**
 * Checks the provided access token (`at`, `accessToken`) and browser ID (`bid`, `browserId`)
 * and throws a redirect to '/session-expired/' if both of them are `undefined`.
 *
 * Optionally, an additional check can be uncommented to throw redirect
 * if only `at` is present in the cookie.
 * This is an impossible case from a logical perspective due to longer maxAge of the `bid` than the `at`,
 * but can be expected in runtime due to slightely abnormal user activity such as
 * manual cookie deletion of `bid` only.
 *
 * If handling such a scenario requires a stricter defence, this additional check
 * can be uncommented to throw a redirect.
 *
 * @param ev
 * @param accessToken
 * @param browserId
 */
export const redirectUnauthorizedUser = (ev: RequestEventAction | RequestEventLoader | RequestEvent, accessToken: string | undefined, browserId: string | undefined) => {
  if (!accessToken && !browserId) throw ev.redirect(302, "/session-expired/")
}
