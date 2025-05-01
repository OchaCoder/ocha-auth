import { component$, useContext, useTask$ } from "@builder.io/qwik"
import { IconCheckCircle, IconCloseSimple, IconWarning } from "./Icons"
import { ContextIdGlobalState } from "../../contexts/ContextGlobalState"

export const Toast = component$(() => {
  const { ctr } = useContext(ContextIdGlobalState)
  useTask$(({ track }) => {
    track(() => ctr.toast.count)
  })

  return (
    <div class={`toast-container`}>
      {ctr.toast.arr.map((t) => (
        <div key={t.id} class={`toast toast-${t.type}`}>
          <div class={`flex justify-center`}>
            {t.type === "green" && <IconCheckCircle size={33} />}
            {(t.type === "red" || t.type === "yellow") && <IconWarning size={33} />}
          </div>
          <div class={`flex items-center`}>{t.txt}</div>
          <div
            class={`flex justify-center cursor-pointer`}
            onClick$={() => {
              // Remove one toast from the arr.
              ctr.toast.arr = ctr.toast.arr.filter((one) => t.id !== one.id)
            }}>
            <IconCloseSimple size={18} />
          </div>
        </div>
      ))}
    </div>
  )
})
