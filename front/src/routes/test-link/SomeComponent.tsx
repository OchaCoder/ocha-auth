import { component$, useSignal, useTask$ } from "@builder.io/qwik"
import { useAddUser } from "./useAction"
import { actionSchema } from "."

export const SomeComponent = component$(() => {
  const action = useAddUser()
  const v = useSignal("This is some default message👀")
  useTask$(({ track }) => {
    track(() => action.value)
    if (!action.value) return
    const parsedData = actionSchema.safeParse(action.value)
    if (parsedData.success) {
      v.value = parsedData.data.payload.userID
    }
  })
  return (
    <>
      <div style={{ width: "300px", height: "60px", backgroundColor: "purple" }} onClick$={() => action.submit({ name: "Johnson💃🌷" })}>
        PRESS ME TO TRIGGER THE ACTION
      </div>
      <div>If the action does the job, we will see some message below.</div>
      <div>{v.value}</div>
    </>
  )
})
