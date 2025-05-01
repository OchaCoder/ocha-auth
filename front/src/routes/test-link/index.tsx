import { component$, isBrowser, isServer, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik"
import { RequestHandler, routeAction$, routeLoader$, server$, z } from "@builder.io/qwik-city"

import wretch from "wretch"

// import { useAction } from "./useAction"
// export { useAction } from "./useAction"

import { useAddUser } from "./useAction"
export { useAddUser } from "./useAction"

import { SomeComponent } from "./SomeComponent"

export const actionSchema = z.object({
  payload: z.object({
    success: z.boolean(),
    userID: z.string(),
  }),
})

export default component$(() => {
  //const action = useAddUser()
  const v = useSignal("default")

  // const handler = async () => {
  //   action.submit({ name: "John" })
  // }

  // useTask$(({ track }) => {
  //   track(() => action.value)
  //   if (!action.value) return
  //   const parsedData = actionSchema.safeParse(action.value)
  //   if (parsedData.success) {
  //     v.value = parsedData.data.payload.userID
  //   }
  // })

  return (
    <section>
      {/* <button onClick$={async () => action.submit({ name: "John" })}>Add user</button>
      {action.value && <p>{action.value.payload.userID}</p>}
      <div>this comes from signal! {v.value}</div> */}
      <SomeComponent />
    </section>
  )
})
