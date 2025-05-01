import { $, component$, useContext, useOnWindow, useStore } from "@builder.io/qwik"
import { routeAction$, useNavigate, z, zod$ } from "@builder.io/qwik-city"
import { ContextIdGlobalState } from "../../../contexts/ContextGlobalState"
import { InputPassword } from "../../../components/AuthPortal/Parts/InputPassword"
import { InputConfirmPassword } from "../../../components/AuthPortal/Parts/InputConfirmPassword"
import { PasswordGuide } from "../../../components/Miscs/PasswordGuide"
import { obfuscateEmail } from "../../../helper-functions/obfuscate-email"
import { backendOpCode } from "../../../helper-functions/fetch-resolver-suite/backend-op-codes"
import { serverInputDataResolver } from "../../../helper-functions/fetch-resolver-suite/resolvers/server-input-data-resolver"
import { wretchResolverGeneralAction } from "../../../helper-functions/fetch-resolver-suite/wretch-resolver-general-action"
import { LoadingSpinner } from "../../../components/Miscs/LoadingSpinner"
import { onSubmitInputChecker } from "~/helper-functions/input-checker-suite/on-submit-input-checker"
import { addToast } from "~/helper-functions/toast-manager"

export const useUserResetPasswordPostEmail = routeAction$(
  async (serverInject, ev) => {
    const code = backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_POST_EMAIL

    const backendInputPayload = serverInputDataResolver(code, serverInject)

    const validatedData = await wretchResolverGeneralAction(backendInputPayload, ev)

    return validatedData
  },

  zod$(
    z.object({
      password: z.string(),
      rpt: z.string(),
    })
  )
)

export default component$(() => {
  const { ctr, userState, backendHealth } = useContext(ContextIdGlobalState)

  // This route should only be accessed via internal navigatioin from `/password-setup/[rpt]`.
  // Direct access to this route is immediately redirected.
  const nav = useNavigate()
  useOnWindow(
    "load",
    $(() => nav("/hmm/"))
  )

  // 1. Create stores for user inputs.
  const password = useStore({ value: "", valueConfirm: "", fx: false })

  // 2. Create an instance of an `routeAction$` and prepare for the backend operation.
  const action = useUserResetPasswordPostEmail()

  // 3. If submit button is clicked, create the `serverInject` payload and trigger `routeAction$`.
  const runSubmit = $(async () => {
    // 3-1. Button turns grey and disabled when either one of Postgres and Redis, or both are not stable.
    if (!backendHealth.stable) return

    // 3-2. Perform input check before enabling button click.
    const { jiggleInputOnError, showToast, checkEmpty, checkFormat } = await onSubmitInputChecker(ctr, { password })

    // 3-3. Show toast with delay.
    showToast()

    // 3-4. Jiggle the button as the check fails.
    jiggleInputOnError()

    // 3-5. Button color stays the same but disabled if checks fail.
    if (!checkEmpty() || !checkFormat()) return // return if any input fields are empty.

    // 3-6. Create `serverInject` payload
    const serverInject = { password: password.value, rpt: userState.rpt }
    // 3-7. Pass the Trigger the action.
    await action.submit(serverInject)

    if (action.value?.success === true) nav("/reset/complete/")
    else if (action.value?.success === false) addToast(ctr.toast, action.value.errorAction.type, action.value.errorAction.message)
  })

  return (
    <>
      <div class="grid justify-center" style={{ gap: "40px" }}>
        <div class="grid justify-center" style={{ gap: "20px" }}>
          <h2 class={`font-size-16 color-theme`} style={{ paddingTop: "20px" }}>
            Password Reset for <span>{obfuscateEmail(userState.email)}</span>
          </h2>
          <InputPassword input={password} />
          <InputConfirmPassword input={password} />
          <div class={`button color-dual-light ${!backendHealth.stable ? `bg-disabled` : `bg-theme hover-bg-theme`}`} onClick$={runSubmit}>
            {action.isRunning ? <LoadingSpinner /> : "Update password"}
          </div>
          <PasswordGuide />
        </div>
      </div>
    </>
  )
})
