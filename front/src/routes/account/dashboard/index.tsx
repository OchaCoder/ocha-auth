import { $, component$, useContext } from "@builder.io/qwik"
import { routeAction$, routeLoader$, useNavigate } from "@builder.io/qwik-city"
import { ContextIdGlobalState } from "../../../contexts/ContextGlobalState"
import { backendOpCode } from "../../../helper-functions/fetch-resolver-suite/backend-op-codes"
import { serverInputDataResolver } from "../../../helper-functions/fetch-resolver-suite/resolvers/server-input-data-resolver"
import { wretchResolverProtected } from "../../../helper-functions/fetch-resolver-suite/wretch-resolver-protected"
import { addToast } from "../../../helper-functions/toast-manager"
import { deleteUserCookiesFromClient } from "../../../helper-functions/delete-user-cookies-from-client"
import { LoadingSpinner } from "../../../components/Miscs/LoadingSpinner"

export const useDashboardLoader = routeLoader$(async (ev) => {
  const code = backendOpCode.protected.loader.LOAD_PROTECTED_USER_DASHBOARD

  const serverData = serverInputDataResolver(code)

  const validatedReply = await wretchResolverProtected(serverData, ev)

  if (!validatedReply || !validatedReply.success) throw ev.redirect(303, "/oops")

  return validatedReply
})

export const useUserSignOutFromThisDevice = routeAction$(async (_, ev) => {
  const code = backendOpCode.protected.action.ACTION_PROTECTED_USER_SIGN_OUT_FROM_ONE

  const bid = ev.cookie.get("bid")?.value
  if (!bid) throw ev.redirect(303, "/session-expired/")

  const serverData = serverInputDataResolver(code, { bid })

  const validatedReply = await wretchResolverProtected(serverData, ev) // Use `action.isRunning` to implement loading icon.

  //if (!validatedReply) throw ev.redirect(303, "/oops/")

  // ⚠️Since this is a 'user sign-out' flow, one might be tempted to clear credential cookies here, server-side.
  // This will result in server-side redirect to '/session-expired/' before showing toast message
  // on this component's client-side code, because`routeLoader$` of this route itself requires credential cookies.
  // routeAction$ -> Backend -> routeAction$ ->x-> routeLoader$ -> client-side operation (show toast)

  return validatedReply
})

export const useUserSignOutFromAllDevices = routeAction$(async (_, ev) => {
  const code = backendOpCode.protected.action.ACTION_PROTECTED_USER_SIGN_OUT_FROM_ALL

  const serverData = serverInputDataResolver(code)

  const validatedReply = await wretchResolverProtected(serverData, ev) // Use `action.isRunning` to implement loading icon.

  return validatedReply
})

export default component$(() => {
  const { userState, ctr, backendHealth } = useContext(ContextIdGlobalState)
  const nav = useNavigate()
  const data = useDashboardLoader().value.data
  const signOutFromThisDevice = useUserSignOutFromThisDevice()
  const signOutFromAllDevices = useUserSignOutFromAllDevices()

  const handleSignOutFromThisDevice = $(async () => {
    await signOutFromThisDevice.submit()

    // Sign-out was successful. Show green toast, and navigate to home.
    if (signOutFromThisDevice.value) {
      if (signOutFromThisDevice.value.success === true) {
        addToast(ctr.toast, "green", "You are successfully signed-out!")
        deleteUserCookiesFromClient()
        userState.name = ""
        nav("/")
      }
      // Sign-out failed. Depending on the backend error, the endresult may involve showing a toast.
      // Otherwise, the user is already redirected server-side. (see `wretchErrorHandler`).
      else if (signOutFromThisDevice.value.success === false) {
        addToast(ctr.toast, signOutFromThisDevice.value.errorAction.type, signOutFromThisDevice.value.errorAction.message)
      }
    }
  })

  const handleSignOutFromAllDevices = $(async () => {
    await signOutFromAllDevices.submit()

    // 1. Sign-out was successful. Show green toast, and navigate to home.
    if (signOutFromAllDevices.value?.success === true) {
      addToast(ctr.toast, "green", "You are successfully signed-out!")
      deleteUserCookiesFromClient()
      userState.name = ""
      nav("/")
    }
    // 2. Sign-out failed. Depending on the backend error, the endresult may involve showing a toast.
    // Otherwise, the user is already redirected server-side. (see `wretchErrorHandler`).
    else if (signOutFromAllDevices.value?.success === false) {
      addToast(ctr.toast, signOutFromAllDevices.value.errorAction.type, signOutFromAllDevices.value.errorAction.message)
    }
  })

  return (
    <div class={`grid justify-center`} style={{ gap: "10px" }}>
      <h2 class={`font-size-13`} style={{ paddingTop: "20px", paddingBottom: "10px" }}>
        {`Welcome to the dashboard, `}
        <span class={`color-theme`}>{userState.name}</span>
      </h2>

      <div class={`grid`} style={{ gap: "10px", border: "solid 1px var(--theme)", padding: "20px" }}>
        <div>
          <div>{`Your account was created on :`}</div>
          <div class={`color-theme`}>{data.createdAt}</div>
        </div>
        <div>
          <div>{`Your data was last modified on :`}</div>
          <div class={`color-theme`}>{data.lastModifiedAt}</div>
        </div>
        <div>
          <div>{`Your email is :`}</div>
          <div class={`color-theme`}>{data.email}</div>
        </div>
        <div class={`flex justify-around`} style={{ paddingTop: "20px", gap: "20px" }}>
          <div
            onClick$={() => {
              // Enable only when Postgres and Redis are both up.
              if (backendHealth.stable) nav("/account/edit")
            }}
            class={`button color-dual-light ${!backendHealth.stable ? `bg-disabled` : `bg-green hover-bg-green`}`}>
            Edit Data
          </div>
          <div
            onClick$={() => {
              // Enable only when Postgres and Redis are both up.
              if (backendHealth.stable) nav("/account/delete")
            }}
            class={`button color-dual-light ${!backendHealth.stable ? `bg-disabled` : `bg-red hover-bg-red`}`}>
            Delete Account
          </div>
        </div>
      </div>
      <div class={`grid justify-center`} style={{ gap: "20px" }}>
        <div
          class={`button color-dual-light ${!backendHealth.stable ? `bg-disabled` : `bg-theme hover-bg-theme`}`}
          style={{ width: "250px" }}
          onClick$={() => {
            if (backendHealth.stable) handleSignOutFromThisDevice()
          }}>
          {signOutFromThisDevice.isRunning ? <LoadingSpinner /> : `Sign Out from This Device`}
        </div>
        <div
          class={`button color-dual-light ${!backendHealth.stable ? `bg-disabled` : `bg-brown hover-bg-brown `}`}
          style={{ width: "250px" }}
          onClick$={() => {
            if (backendHealth.stable) handleSignOutFromAllDevices()
          }}>
          {signOutFromAllDevices.isRunning ? <LoadingSpinner /> : `Sign Out from All Devices`}
        </div>
      </div>
    </div>
  )
})
