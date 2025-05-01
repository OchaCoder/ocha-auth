import { $, component$, useStore } from "@builder.io/qwik"
import { txtGeneral, txtTip } from "../../../texts"
import { ValidateEmail } from "../../../helper-functions/input-checker-suite/common/typebox-validator"

export const InputEmail = component$(({ input }: { input: { value: string; fx: boolean } }) => {
  const store = useStore({ showHelper: false, helperText: "" })

  const checkEmail = $(() => {
    if (input.value === "") {
      store.showHelper = true
      store.helperText = txtTip.inputHelper.email.empty
    } else if (!ValidateEmail.Check(input.value)) {
      store.showHelper = true
      store.helperText = txtTip.inputHelper.email.invalid
    }
  })

  return (
    <div class={`input-theme ${input.fx && `shake`}`}>
      <label for="auth-email" class={input.value && "input-has-data"}>
        {txtGeneral.email}
      </label>
      <input
        id="auth-email"
        type="email"
        required
        onInput$={(_, el: HTMLInputElement) => {
          input.value = el.value
          input.value.length > 0 && (store.showHelper = false)
        }}
        onBlur$={checkEmail}
      />
      {store.showHelper && <div class="input-auth-helper">{store.helperText}</div>}
    </div>
  )
})
