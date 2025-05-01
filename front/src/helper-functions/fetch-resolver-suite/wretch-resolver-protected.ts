import { RequestEvent, RequestEventAction, RequestEventLoader } from "@builder.io/qwik-city"
import wretch from "wretch"
import { configPublic } from "../../config-public"
import { wretchErrorHandler } from "./wretch-error-handler"
import { redirectUnauthorizedUser } from "./redirect-unauthorized-user"
import { backendPathResolver } from "./map/backend-path-map"
import { uncheckedAccessTokenAndBrowserIdResolver } from "./resolvers/unchecked-access-token-and-browser-id-resolver"
import { ProtectedActionCode, ProtectedLoaderCode } from "./backend-op-codes"
import { setCookieFromServer } from "../set-cookie-helpers"
import { rawReplyValidator } from "./raw-reply-validator"

export const wretchResolverProtected = async <const C extends ProtectedLoaderCode | ProtectedActionCode>(
  serverData: {
    code: C
    payload: { hasData: true; data: any } | { hasData: false; data: null }
  },
  ev: RequestEventLoader | RequestEventAction | RequestEvent
) => {
  // 1. `isUserSignIn` helper only eliminates `(!at&&!bid)` pattern, and takes action before fetch.
  // At this stage, `at` or `bid` could still be type of both string or undefined, but not both undefined at the same time.
  const { at, bid } = uncheckedAccessTokenAndBrowserIdResolver(ev)

  // 2. Redirect unauthorized user.
  // After this line, it becomes guaranteed that at least either one of the `at` or `bid` is present.
  redirectUnauthorizedUser(ev, at, bid)

  // 3. Resolve the backend path from the backend op code (`code`)
  const backendPath = backendPathResolver(serverData.code)

  // 4-1. Use the `at` to proceed to the backend operation.
  if (at) {
    const rawReply = await wretch(`${configPublic.BACKEND_URL}${backendPath}`)
      .headers({ gatekeeper: "3bQdY1mE3agwuYqelMyjoS3GDaTY6iTtpxmg" })
      .post({ at, payload: serverData.payload })
      .json()
      .catch((err) => wretchErrorHandler(err, ev))

    const validatedReply = rawReplyValidator(rawReply, serverData.code, ev)

    return validatedReply
  }

  // 4-2. Use the `bid` to proceed to the backend operation.

  // `/proxy-adapter/refresh-access-token` is a special backend route that proxies request to the
  // originally desired route directly within Fastify after successfully generating a new `at`,
  // without requireing an extra round trip between Qwik and Fastify.
  // This route requires always requires three things:
  // 1. the `bid`, 2. the desired path for the request to be forwarded to, and 3. the payload.
  // Notice that this resolver's always requires either
  // `{ hasData: true; data: any }` or `{ hasData: false; data: null }` as its `payload` argument.
  // this is to favor an explicit design to enforce the unified payload check in the backend.
  else if (bid) {
    const rawReply = await wretch(`${configPublic.BACKEND_URL}/general/auth/proxy-adapter/refresh-access-token`)
      .post({ bid, proxyPath: backendPath, payload: serverData.payload })
      .json()
      .catch((err) => wretchErrorHandler(err, ev))

    // Validate the rawReply
    //const validatedReply = validatedReplyResolver<C>(ev, serverData.code, serverData.payload)

    const validatedReply = rawReplyValidator(rawReply, serverData.code, ev)

    // If `bid` was used, and the reply comes back as `success:true`, the cookie data for
    // updating the `at` and the `bid` is guaranteed to exist.
    // On the other hand, if reply comes back as `success:false`, this usually means that the
    // user signin via `bid` failed in a 'valid' fashion, in which case the frontend is
    // required to show an appropriate toast message.
    // (e.g. 'We couldn't sign you in. Please check your email or password.')
    // If the backend had detected more critical scenarios such as suspicious activity or
    // a possible bug scenario, these cases are already handled inside catch-block by
    // `wretchErrorhandler`, and will not even reach here.
    //

    if (validatedReply.success) {
      // This is a bug. If `bid` was used, and the reply comes back as `success:true`,
      // `hasData` should be true, and the cookie data should also be present.
      if (!validatedReply.sideEffects.cookie.hasData) throw ev.redirect(302, "/oops")

      setCookieFromServer(ev.cookie, "at", validatedReply.sideEffects.cookie.data.newAt.token, validatedReply.sideEffects.cookie.data.newAt.maxAge)
      setCookieFromServer(ev.cookie, "bid", bid, validatedReply.sideEffects.cookie.data.newBid.maxAge)
      // Fastify is designed to return the same `bid` as `validatedReply.sideEffects.cookie.data.newBid.token`,
      // so the following code will yield in the same result.
      //setCookieFromServer(ev.cookie, "bid", validatedReply.sideEffects.cookie.data.newBid.token, validatedReply.sideEffects.cookie.data.newBid.maxAge)
    }
    // Return the validated reply.
    return validatedReply
  }
}
