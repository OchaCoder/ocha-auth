import { globalAction$, z, zod$ } from "@builder.io/qwik-city"
import { wretchResolverGeneralAction } from "../../helper-functions/fetch-resolver-suite/wretch-resolver-general-action"
import { backendOpCode } from "~/helper-functions/fetch-resolver-suite/backend-op-codes"
import { serverInputDataResolver } from "~/helper-functions/fetch-resolver-suite/resolvers/server-input-data-resolver"
import { setCookieFromServer } from "~/helper-functions/set-cookie-helpers"
// eslint-disable-next-line qwik/loader-location
export const useUserRegisterAction = globalAction$(
  async (serverInject, ev) => {
    const code = backendOpCode.general.action.ACTION_GENERAL_AUTH_USER_REGISTER

    const backendInputPayload = serverInputDataResolver(code, serverInject)

    const validatedData = await wretchResolverGeneralAction(backendInputPayload, ev)

    if (validatedData.success && validatedData.sideEffects.cookie.hasData) {
      setCookieFromServer(ev.cookie, "at", validatedData.sideEffects.cookie.data.newAt.token, validatedData.sideEffects.cookie.data.newAt.maxAge)
      setCookieFromServer(ev.cookie, "bid", validatedData.sideEffects.cookie.data.newBid.token, validatedData.sideEffects.cookie.data.newBid.maxAge)
      setCookieFromServer(ev.cookie, "uid", btoa(validatedData.data.userName), 60 * 60 * 24 * 30 * 6)
    }
    return validatedData
  },
  zod$(
    z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    })
  )
)
