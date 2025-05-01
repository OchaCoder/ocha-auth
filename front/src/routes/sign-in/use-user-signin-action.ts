import { globalAction$, z, zod$ } from "@builder.io/qwik-city"
import { backendOpCode } from "../../helper-functions/fetch-resolver-suite/backend-op-codes"
import { serverInputDataResolver } from "../../helper-functions/fetch-resolver-suite/resolvers/server-input-data-resolver"
import { wretchResolverGeneralAction } from "../../helper-functions/fetch-resolver-suite/wretch-resolver-general-action"
import { setCookieFromServer } from "../../helper-functions/set-cookie-helpers"

export const useUserSignInAction = globalAction$(
  async (serverInject, ev) => {
    const code = backendOpCode.general.action.ACTION_GENERAL_AUTH_USER_SIGN_IN

    const backendInputPayload = serverInputDataResolver(code, serverInject)
    console.log("backendInputPayload", backendInputPayload)
    const validatedData = await wretchResolverGeneralAction(backendInputPayload, ev)

    if (validatedData.success && validatedData.sideEffects.cookie.hasData) {
      setCookieFromServer(ev.cookie, "at", validatedData.sideEffects.cookie.data.newAt.token, validatedData.sideEffects.cookie.data.newAt.maxAge)
      setCookieFromServer(ev.cookie, "bid", validatedData.sideEffects.cookie.data.newBid.token, validatedData.sideEffects.cookie.data.newBid.maxAge)
      setCookieFromServer(ev.cookie, "uid", btoa(validatedData.data.userName), 60 * 60 * 24 * 30 * 6)
    }

    return validatedData
  },
  zod$(z.object({ email: z.string().email(), password: z.string() }))
)
