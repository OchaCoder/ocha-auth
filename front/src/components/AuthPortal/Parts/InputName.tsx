import { component$, useSignal } from "@builder.io/qwik"
import { txtGeneral, txtTip } from "../../../texts"

export const InputName = component$(({ input }: { input: { value: string; fx: boolean } }) => {
  const showHelper = useSignal(false)
  return (
    <div class={`input-theme ${input.fx && `shake`}`}>
      <label for="auth-name" class={input.value && "input-has-data"}>
        {txtGeneral.name}
      </label>
      <input
        id="auth-name"
        type="text"
        required
        onInput$={(_, el: HTMLInputElement) => {
          input.value = el.value
          input.value.length > 0 && (showHelper.value = false)
        }}
        onBlur$={(_, el: HTMLInputElement) => el.value.length <= 1 && (showHelper.value = true)}
      />
      {showHelper.value && <div class="input-auth-helper">{txtTip.inputHelper.name.empty}</div>}
    </div>
  )
})
