import { component$, isServer, useContext, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik"
import { routeAction$, useNavigate } from "@builder.io/qwik-city"
import { ContextIdGlobalState } from "../../../contexts/ContextGlobalState"
import { addToast } from "../../../helper-functions/toast-manager"
import { backendOpCode } from "../../../helper-functions/fetch-resolver-suite/backend-op-codes"
import { serverInputDataResolver } from "../../../helper-functions/fetch-resolver-suite/resolvers/server-input-data-resolver"
import { wretchResolverProtected } from "../../../helper-functions/fetch-resolver-suite/wretch-resolver-protected"
import { LoadingSpinner } from "~/components/Miscs/LoadingSpinner"

export const useUserDeleteAccount = routeAction$(async (_, ev): Promise<any> => {
  const code = backendOpCode.protected.action.ACTION_PROTECTED_USER_DELETE

  const serverData = serverInputDataResolver(code)

  const validatedData = await wretchResolverProtected(serverData, ev)

  if (validatedData && validatedData.success) {
    ev.cookie.delete("at", { path: "/" })
    ev.cookie.delete("bid", { path: "/" })
    ev.cookie.delete("uid", { path: "/" })
  }

  return validatedData
})

export default component$(() => {
  const { ctr, userState } = useContext(ContextIdGlobalState)
  const action = useUserDeleteAccount()

  useTask$(async ({ track }) => {
    track(() => action.value)

    if (isServer || !action.value) return

    if (action.value.success === false) addToast(ctr.toast, action.value.errorAction.type, action.value.errorAction.message)
  })

  const DeleteUser = component$(() => {
    return (
      <div class={`grid justify-center`} style={{ padding: "30px", gap: "30px" }}>
        <h2 class="flex justify-center font-size-13">
          <span>{`We will delete your`}&nbsp;</span>
          <span class={`color-theme`}>{userState.name}</span>
          <span>&nbsp;{`account.`}</span>
        </h2>
        <div class={`flex justify-center font-size-10`}>We will delete your account!💡 Are you sure?</div>
        <div class={`grid justify-center`}>
          <div class={`button bg-theme color-dual-light`} style={{ width: "250px" }} onClick$={() => action.submit()}>
            {action.isRunning ? <LoadingSpinner /> : `Delete Account Now`}
          </div>
        </div>
      </div>
    )
  })

  const DeletionCompleted = component$(() => {
    const nav = useNavigate()
    const countDown = useSignal(10)

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      userState.name = ""
      const interval = setInterval(() => {
        if (countDown.value > 0) {
          countDown.value--
        } else {
          clearInterval(interval)
          nav("/")
        }
      }, 1000)
    })
    return (
      <div class={`grid justify-center`} style={{ padding: "30px", gap: "30px" }}>
        <h2 class="grid justify-center font-size-13">Your account was deleted successfully. Thank you for trying us out!🌸</h2>
        <div>
          <span>{`We will redirect you to home in `}</span>
          <span class={`color-theme`}>{countDown.value}</span>
          <span>{` second.`}</span>
        </div>
      </div>
    )
  })

  return <>{action.value?.success ? <DeletionCompleted /> : <DeleteUser />}</>
})
