import { $, component$, useOnWindow } from "@builder.io/qwik"
import { useNavigate } from "@builder.io/qwik-city"

export default component$(() => {
  const nav = useNavigate()

  // This page should only reached via within-site navigation.
  // Direct access should be redirected immedietely.
  useOnWindow(
    "load",
    $(() => nav("/"))
  )
  return (
    <div class={`grid justify-center`} style={{ padding: "30px", gap: "30px" }}>
      <h2 class="grid justify-center font-size-14 color-theme">Something’s not right.</h2>
      <div class={`grid`} style={{ gap: "8px", fontSize: "18px" }}>
        <div>Your request didn't go through at this time.</div>
        <div>Please try again from the beginning!</div>
      </div>
    </div>
  )
})
