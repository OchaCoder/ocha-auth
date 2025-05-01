import { $, component$, useContext, useStore, useTask$ } from "@builder.io/qwik"
import { ContextIdGlobalState } from "../../../contexts/ContextGlobalState"
import { txtGeneral, txtTip } from "../../../texts"
import { IconVisible, IconVisibleOff } from "../../Miscs/Icons"

import { passwordChecker } from "~/helper-functions/input-checker-suite/real-time-password-checker"

export const InputPassword = component$(({ input }: { input: { value: string; valueConfirm: string; fx: boolean } }) => {
  const { ctr } = useContext(ContextIdGlobalState)

  // Note: useStore cannot hold the timeout ID if it’s an instance of 'NodeJS.Timeout',
  // because such objects are not serializable by Qwik’s resumability system.
  const store = useStore<{ showHelper: boolean; timeout: number | null; helperText: string }>({ showHelper: false, timeout: null, helperText: "" })

  useTask$(({ track }) => {
    // Reset store values.
    track(() => ctr.authCode)
    input.value = ""
    store.showHelper = false
    store.timeout = null
    store.helperText = ""
  })

  const runInputOp = $(async (el: HTMLInputElement) => {
    input.value = el.value

    // Clean up the timeout on re-run.
    store.timeout && clearTimeout(store.timeout)

    // Avoid giving away hints about password format.
    if (ctr.authCode === "SIGN_IN") return

    const isValid = await passwordChecker(ctr, el.value)

    // 1. The password format is not fulfilled.
    if (!isValid) {
      // Don't show helper text if the input field is empty
      if (el.value === "") store.showHelper = false
      else {
        // Since NodeJS.Timeout instances break serialization,
        // `window.setTimeout` is used explicitly to guarantee a numeric timeout ID,
        store.timeout = window.setTimeout(() => {
          store.showHelper = true
          store.helperText = txtTip.inputHelper.password.invalid
        }, 1400)
      }
    }
    // 2. The password format is fulfilled.
    else {
      store.showHelper = false
      store.helperText = ""
    }
  })

  // If the user quickly clicks away while the input value is empty or invalid,
  // show the helper text immediately without the delayed update from `unInputOp`.
  const runBlurOp = $(async (el: HTMLInputElement) => {
    if (el.value === "") {
      store.showHelper = true
      store.helperText = txtTip.inputHelper.password.empty
    } else if (!(await passwordChecker(ctr, el.value))) {
      store.showHelper = true
      store.helperText = txtTip.inputHelper.password.invalid
    }
  })

  return (
    <div class={`input-theme ${input.fx && `shake`}`}>
      <label for="auth-password" class={input.value && "input-has-data"}>
        {txtGeneral.password}
      </label>

      <input id="auth-password" type={ctr.visible ? "text" : "password"} required onInput$={async (_, el: HTMLInputElement) => runInputOp(el)} onBlur$={(_, el: HTMLInputElement) => runBlurOp(el)} />

      <div class="auth-input-visible" onClick$={() => (ctr.visible = !ctr.visible)}>
        {ctr.visible ? <IconVisible fill={`var(--theme)`} /> : <IconVisibleOff fill={`var(--theme)`} />}
      </div>

      {store.showHelper && <div class="input-auth-helper">{store.helperText}</div>}
    </div>
  )
})
