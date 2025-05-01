import { component$, useContext } from "@builder.io/qwik"
import { txtTip } from "~/texts"
import { IconCheckCircle } from "./Icons"
import { ContextIdGlobalState } from "~/contexts/ContextGlobalState"

export const PasswordGuide = component$(() => {
  const { ctr } = useContext(ContextIdGlobalState)
  return (
    <div class="grid" style={{ paddingTop: "20px", paddingLeft: "20px", gap: "5px" }}>
      <h3 class="font-size-9">{txtTip.password.title}</h3>

      <div class="flex items-center font-size-8">
        <IconCheckCircle fill={`${ctr.passwordGuide.hasLength ? `var(--ok)` : `var(--gray)`}`} size={18} />
        {txtTip.password.tipLength}
      </div>
      <div class={`flex items-center font-size-8 `}>
        <IconCheckCircle fill={`${ctr.passwordGuide.hasLetter ? `var(--ok)` : `var(--gray)`}`} size={18} />
        {txtTip.password.tipLetter}
      </div>
      <div class="flex items-center font-size-8">
        <IconCheckCircle fill={`${ctr.passwordGuide.hasNumber ? `var(--ok)` : `var(--gray)`}`} size={18} />
        {txtTip.password.tipNumber}
      </div>
      <div class="flex items-center font-size-8">
        <IconCheckCircle fill={`${ctr.passwordGuide.hasSpecial ? `var(--ok)` : `var(--gray)`}`} size={18} />
        {txtTip.password.tipSpecial}
      </div>
    </div>
  )
})
