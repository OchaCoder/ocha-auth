import { component$, isServer, useContext, useStore, useTask$ } from "@builder.io/qwik"
import { ContextIdGlobalState } from "../../../contexts/ContextGlobalState"
import { txtGeneral, txtTip } from "../../../texts"
import { IconVisible, IconVisibleOff } from "../../Miscs/Icons"

export const InputConfirmPassword = component$(({ input }: { input: { value: string; valueConfirm: string; fx: boolean } }) => {
  const { ctr } = useContext(ContextIdGlobalState)
  const store = useStore<{ initialState: boolean; timeout: number | null; showHelper: boolean }>({ initialState: true, timeout: null, showHelper: false })

  useTask$(({ track }) => {
    track(() => input.value)
    track(() => input.valueConfirm)
    if (isServer) return // Make sure this doesn't run server-side
    if (store.initialState) return
    store.timeout && clearTimeout(store.timeout)

    // Show helper text with time lag if not matching.
    if (input.value !== input.valueConfirm) {
      store.timeout = window.setTimeout(() => (store.showHelper = true), 1200)
    }
    // Clear helper text immediately if matching
    else store.showHelper = false
  })

  return (
    <div class={`input-theme ${input.fx && `shake`}`}>
      <label for="auth-confirm-password" class={input.valueConfirm && "input-has-data"}>
        {txtGeneral.confirmPassword}
      </label>
      <input
        id="auth-confirm-password"
        type={ctr.visible ? "text" : "password"}
        required
        onInput$={(_, el: HTMLInputElement) => {
          store.initialState = false
          input.valueConfirm = el.value
        }}
        onBlur$={() => {
          if (input.valueConfirm !== input.value) store.showHelper = true
        }}
      />

      {/* Clickable Eye Icon */}
      <div class="auth-input-visible" onClick$={() => (ctr.visible = !ctr.visible)}>
        {ctr.visible ? <IconVisible fill={`var(--theme)`} /> : <IconVisibleOff fill={`var(--theme)`} />}
      </div>

      {/* Helper Text */}
      {store.showHelper && <div class="input-auth-helper">{txtTip.inputHelper.confirmPassword.noMatch}</div>}
    </div>
  )
})
