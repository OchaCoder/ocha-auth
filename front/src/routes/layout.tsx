import { $, component$, isBrowser, Slot, useContext, useOnWindow, useTask$ } from "@builder.io/qwik"
import { type RequestHandler } from "@builder.io/qwik-city"
import { ContextIdGlobalState } from "../contexts/ContextGlobalState"

import { Header } from "../components/Header/Header.tsx"
import { Toast } from "../components/Miscs/Toast"
import { BackendDownWarning } from "../components/Miscs/BackendDownWarning"

import { loadMode, loadUserName } from "../helper-functions/load-initial-data"
import { sseHealthChecker } from "../helper-functions/sse-health-checker"

export const onRequest: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  })
}

export const height = { header: 140, greeting: 30 }

export default component$(() => {
  const { ctr, userState, backendHealth } = useContext(ContextIdGlobalState)

  const setupPage = $(async () => {
    ctr.darkMode = await loadMode()
    userState.name = await loadUserName()
    sseHealthChecker(backendHealth)
  })
  useOnWindow("load", setupPage)

  useTask$(({ track }) => {
    track(() => ctr.darkMode)
    if (isBrowser) document.documentElement.classList.toggle("dark", ctr.darkMode)
  })

  return (
    <div class="flex justify-center">
      <div style={{ maxWidth: "800px" }}>
        <Header height={height.header} />
        <Toast />
        <Slot />
        <BackendDownWarning />
      </div>
    </div>
  )
})
