import { $, component$, useContext, useOnWindow } from "@builder.io/qwik"
import { type RequestHandler, routeLoader$, useNavigate } from "@builder.io/qwik-city"
import { LoadingSpinner } from "../../../../components/Miscs/LoadingSpinner"
import { ContextIdGlobalState } from "../../../../contexts/ContextGlobalState"
import { height } from "../../../../routes/layout"
import { wretchResolverGeneralAction } from "../../../../helper-functions/fetch-resolver-suite/wretch-resolver-general-action"
import { serverInputDataResolver } from "../../../../helper-functions/fetch-resolver-suite/resolvers/server-input-data-resolver"
import { backendOpCode } from "../../../../helper-functions/fetch-resolver-suite/backend-op-codes"

/**
 * This route serves as the sole receiver of the reset password token (rpt),
 * and acts as a tunnel with two main responsibilities:
 *
 * -1. Perform a lightweight check on the token (e.g., static prefix validation)
 * -2. Funnel the rpt to the actual password setup route ('/password-setup')
 *
 * The goal is to keep the sender route clean and focused.
 * While this route includes basic protection against abuse, such as rejecting
 * obviously invalid tokens, full validation is intentionally delegated to the backend.
 */
export const onRequest: RequestHandler = async (ev) => {
  // Perform a lightweight format check on the reset password token (rpt).
  // If the token is missing or does not start with the expected prefix, redirect immediately.
  if (!(ev.params.rpt && ev.params.rpt.startsWith("puf"))) {
    throw ev.redirect(303, "/hmm/")
  }
  // Strip the prefix ('puf') and store the token in sharedMap.
  const rptObjV4Websafe = ev.params.rpt.slice(3)
  const code = backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_VERIFY_TOKEN
  const serverInject = { rpt: rptObjV4Websafe }
  const serverData = serverInputDataResolver(code, serverInject)

  const validatedData = await wretchResolverGeneralAction(serverData, ev)

  if (!validatedData.success) throw ev.redirect(302, "/oops")

  const { rpt, obfuscatedEmail } = validatedData.data
  ev.sharedMap.set("rpt", rpt)
  ev.sharedMap.set("obfuscatedEmail", obfuscatedEmail)
}

type RptObj = { rpt: string; obfuscatedEmail: string }

// Retrieve the rpt value from sharedMap.
export const useLoader = routeLoader$(({ sharedMap }): RptObj => {
  const rpt = sharedMap.get("rpt")
  const obfuscatedEmail = sharedMap.get("obfuscatedEmail")
  return { rpt, obfuscatedEmail }
})

export default component$(() => {
  const { rpt, obfuscatedEmail } = useLoader().value
  const { ctr, userState } = useContext(ContextIdGlobalState)
  const nav = useNavigate()

  // This route should only be accessed via the email link,
  // which means all valid access should begin with an initial page load.
  useOnWindow(
    "load",
    $(() => {
      userState.rpt = rpt
      userState.email = obfuscatedEmail
      ctr.authCode = "SETUP_PASSWORD"
      setTimeout(() => {
        nav("/reset/password-setup")
      }, 1000)
    })
  )

  const styleLoaderWrap = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: `calc(100vh - ${height.header}px)`,
    gap: "10px",
  }

  return (
    <>
      <div style={styleLoaderWrap}>
        <LoadingSpinner /> <div>Loading...</div>
      </div>
    </>
  )
})
