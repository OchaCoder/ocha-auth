import { $, component$, useContext, useOnWindow, useStore } from "@builder.io/qwik"
import { txtGeneral, txtTip } from "../../texts"
import { ContextIdGlobalState } from "../../contexts/ContextGlobalState"
import { InputName } from "../../components/AuthPortal/Parts/InputName"
import { InputEmail } from "../../components/AuthPortal/Parts/InputEmail"
import { InputPassword } from "../../components/AuthPortal/Parts/InputPassword"
import { InputConfirmPassword } from "../../components/AuthPortal/Parts/InputConfirmPassword"
import { PasswordGuide } from "../../components/Miscs/PasswordGuide"
import { useUserRegisterAction } from "./use-user-register-action"
import { LoadingSpinner } from "../../components/Miscs/LoadingSpinner"
import { addToast } from "../../helper-functions/toast-manager"
import { onSubmitInputChecker } from "../../helper-functions/input-checker-suite/on-submit-input-checker"
import { useNavigate } from "@builder.io/qwik-city"

export const Register = component$(() => {
  const { ctr, backendHealth, userState } = useContext(ContextIdGlobalState)
  const nav = useNavigate()
  // 1. Create stores for user inputs.
  const name = useStore({ value: "", fx: false })
  const email = useStore({ value: "", fx: false })
  const password = useStore({ value: "", valueConfirm: "", fx: false })

  // 2. Create an instance of an `routeAction$` and prepare for the backend operation.
  const action = useUserRegisterAction()

  // 3. If submit button is clicked, create the `serverInject` payload and trigger `routeAction$`.
  const runSubmit = $(async () => {
    // 3-1. Button turns grey and disabled when either one of Postgres and Redis, or both are not stable.
    if (!backendHealth.stable) return

    // 3-2. Perform input check before enabling button click.
    const { jiggleInputOnError, showToast, checkEmpty, checkFormat } = await onSubmitInputChecker(ctr, { name, email, password })

    // 3-3. Jiggle the button as the check fails.
    showToast()
    jiggleInputOnError()

    // 3-4. Button color stays the same but disabled if checks fail.
    if (!checkEmpty() || !checkFormat()) return // return if any input fields are empty.

    // 3-5. Create `serverInject` payload
    const serverInject = { name: name.value, email: email.value, password: password.value }

    // 3-6. Pass the Trigger the action.
    await action.submit(serverInject)

    if (action.value?.success === true) {
      userState.name = action.value.data.userName
      name.value = ""
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
      window.history.pushState({}, "", "/register/")
    })
  )

  return (
    <div class="grid" style={{ gap: "20px" }}>
      <h2 class="auth-title" style={{ width: "160px" }}>
        {txtGeneral.signUp}
      </h2>
      <div class="flex flex-column items-center" style={{ gap: "25px" }}>
        <InputName input={name} />
        <InputEmail input={email} />
        <InputPassword input={password} />
        <InputConfirmPassword input={password} />
        {/* maybe use onClick to trigger Action here? */}

        <div class={`button color-dual-light ${!backendHealth.stable ? `bg-disabled` : `bg-theme hover-bg-theme`}`} onClick$={runSubmit}>
          {action.isRunning ? <LoadingSpinner /> : "Register"}
        </div>
      </div>
      <div class="flex justify-center">
        <div>
          <span>{txtTip.call.alreadyHasAccount}&nbsp;</span>
          <span
            class="color-theme cursor-pointer"
            onClick$={() => {
              ctr.authCode = "SIGN_IN"
              nav("/sign-in/")
            }}>
            {txtGeneral.signIn}!
          </span>
        </div>
      </div>
      <PasswordGuide />
    </div>
  )
})
