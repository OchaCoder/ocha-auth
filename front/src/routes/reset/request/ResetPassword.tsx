import { $, component$, isServer, useContext, useStore, useTask$ } from "@builder.io/qwik"
import { ContextIdGlobalState } from "../../../contexts/ContextGlobalState"
import { txtGeneral, txtTip } from "../../../texts"
import { globalAction$, useNavigate, z, zod$ } from "@builder.io/qwik-city"
import { backendOpCode } from "../../../helper-functions/fetch-resolver-suite/backend-op-codes"
import { serverInputDataResolver } from "../../../helper-functions/fetch-resolver-suite/resolvers/server-input-data-resolver"
import { wretchResolverGeneralAction } from "../../../helper-functions/fetch-resolver-suite/wretch-resolver-general-action"
import { InputEmail } from "../../../components/AuthPortal/Parts/InputEmail"
import { LoadingSpinner } from "../../../components/Miscs/LoadingSpinner"
import { addToast } from "../../../helper-functions/toast-manager"
import { onSubmitInputChecker } from "../../../helper-functions/input-checker-suite/on-submit-input-checker"

const code = backendOpCode.general.action.ACTION_GENERAL_AUTH_RESET_PASSWORD_PRE_EMAIL

export const useUserResetPasswordAction = globalAction$(
  async (serverInject, ev) => {
    const backendInputPayload = serverInputDataResolver(code, serverInject)

    const validatedReply = await wretchResolverGeneralAction(backendInputPayload, ev)

    return validatedReply
  },
  zod$(z.object({ email: z.string().email() }))
)

export const ResetPassword = component$(() => {
  const nav = useNavigate()
  const { ctr, backendHealth, userState } = useContext(ContextIdGlobalState)

  // 1. Create stores for user inputs.

  const email = useStore({ value: "", fx: false })

  // 2. Create an instance of an `routeAction$` and prepare for the backend operation.
  const action = useUserResetPasswordAction()

  // 3. If submit button is clicked, create the `serverInject` payload and trigger `routeAction$`.
  const runSubmit = $(async () => {
    // 3-1. Button turns grey and disabled when either one of Postgres and Redis, or both are not stable.
    if (!backendHealth.stable) return

    // 3-2. Perform input check before enabling button click.
    const { jiggleInputOnError, showToast, checkEmpty, checkFormat } = await onSubmitInputChecker(ctr, { email })

    // 3-3. Show toast on error.
    showToast()

    // 3-4. Jiggle the button as the check fails.
    jiggleInputOnError()

    // 3-5. Button color stays the same but disabled if checks fail.
    if (!checkEmpty() || !checkFormat()) return // return if any input fields are empty.

    // 3-6. Create `serverInject` payload
    const serverInject = { email: email.value }

    // 3-7. Pass the Trigger the action.
    await action.submit(serverInject)

    // 3-8. Update `userState.email` to display `email` in the 'reset/request/complete' page.
    userState.email = email.value

    if (action.value?.success === true) nav("/reset/request/complete/")
    else if (action.value?.success === false) addToast(ctr.toast, action.value.errorAction.type, action.value.errorAction.message)
  })

  return (
    <div class="grid" style={{ gap: "20px" }}>
      <h2 class="auth-title" style={{ width: "200px" }}>
        {txtGeneral.resetPassword}
      </h2>
      <div class="flex flex-column items-center" style={{ gap: "25px" }}>
        <InputEmail input={email} />

        <div class={`button color-dual-light ${!backendHealth.stable ? `bg-disabled` : `bg-theme hover-bg-theme`}`} onClick$={runSubmit}>
          {action.isRunning ? <LoadingSpinner /> : "Reset Password"}
        </div>
      </div>
      <div class="flex justify-center">
        <div>
          <span>{txtTip.call.alreadyHasAccount}&nbsp;</span>
          <span
            class="color-theme cursor-pointer"
            onClick$={() => {
              ctr.authCode = "SIGN_IN"
              window.history.pushState({}, "", "/signin/")
            }}>
            {txtGeneral.signIn}!
          </span>
        </div>
      </div>
    </div>
  )
})
