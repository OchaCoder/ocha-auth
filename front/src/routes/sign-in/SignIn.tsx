import { $, component$, useContext, useOnWindow, useStore } from "@builder.io/qwik"
import { InputEmail } from "../../components/AuthPortal/Parts/InputEmail"
import { InputPassword } from "../../components/AuthPortal/Parts/InputPassword"
import { ContextIdGlobalState } from "../../contexts/ContextGlobalState"
import { txtGeneral, txtTip } from "../../texts"
import { useUserSignInAction } from "./use-user-signin-action"
import { addToast } from "../../helper-functions/toast-manager"
import { LoadingSpinner } from "../../components/Miscs/LoadingSpinner"
import { useNavigate } from "@builder.io/qwik-city"
import { onSubmitInputChecker } from "../../helper-functions/input-checker-suite/on-submit-input-checker"

export const SignIn = component$(() => {
  const { ctr, backendHealth, userState } = useContext(ContextIdGlobalState)
  const nav = useNavigate()

  // 1. Create stores for user inputs.
  const email = useStore({ value: "", fx: false })
  const password = useStore({ value: "", valueConfirm: "", fx: false })

  // 2. Create an instance of an `routeAction$` and prepare for the backend operation.
  const action = useUserSignInAction()

  // 3. If submit button is clicked, create the `serverInject` payload and trigger `routeAction$`.
  const runSubmit = $(async () => {
    // 3-1. Button turns grey and disabled when either one of Postgres and Redis, or both are not stable.
    if (!backendHealth.stable) return

    // 3-2. Perform input check before enabling button click.
    const { showToast, checkEmpty } = await onSubmitInputChecker(ctr, { email, password })

    // 3-3. Show toast with delay if check fails.
    showToast()

    // 3-5. Button color stays the same but disabled if checks fail.
    if (!checkEmpty()) return // return if any input fields are empty.

    // 3-6. Create `serverInject` payload
    const serverInject = { email: email.value, password: password.value }

    // 3-7. Pass the Trigger the action.
    await action.submit(serverInject)

    if (action.value?.success === true) {
      userState.name = action.value.data.userName

      email.value = ""
      password.value = ""
      nav("/account/dashboard/")
    }
    // If there was an error, show toast. (Redirect cases are already handled server-side)
    else if (action.value?.success === false) addToast(ctr.toast, action.value.errorAction.type, action.value.errorAction.message)
  })

  useOnWindow(
    "load",
    $(() => {
      window.history.pushState({}, "", "/sign-in/")
    })
  )

  return (
    <div class="grid" style={{ gap: "40px" }}>
      <h2 class="auth-title" style={{ width: "160px" }}>
        {txtGeneral.signIn}
      </h2>
      <div class="flex flex-column items-center" style={{ gap: "30px" }}>
        <InputEmail input={email} />
        <InputPassword input={password} />
        <div class={`button color-dual-light ${!backendHealth.stable ? `bg-disabled` : `bg-theme hover-bg-theme`}`} onClick$={runSubmit}>
          {action.isRunning ? <LoadingSpinner /> : "Sign in"}
        </div>
      </div>
      {/* Options to render different auth components */}
      <div class="grid" style={{ gap: "10px" }}>
        <div>
          <span>{txtTip.call.noAccount}&nbsp;</span>
          <span
            class="color-theme cursor-pointer"
            onClick$={() => {
              ctr.authCode = "REGISTER"
              nav("/register/")
            }}>
            {txtTip.call.joinNow}
          </span>
        </div>
        <div>
          <span>{txtTip.call.forgotPassword}&nbsp;</span>
          <span class="color-theme cursor-pointer" onClick$={() => (ctr.authCode = "RESET_PASSWORD")}>
            {txtTip.call.clickHere}
          </span>
        </div>
      </div>
    </div>
  )
})
