import { component$ } from "@builder.io/qwik"

/**
 * Navigate user to this page if the backend is down.
 * Normal error such as wrong email should be handled in a vague fashion to ensure security.
 * For such case, user should be navigated to '/request/complete/'.
 */
export default component$(() => {
  return (
    <div class={`grid justify-center`} style={{ padding: "30px", gap: "30px" }}>
      <h2 class="grid justify-center font-size-14 color-theme">Something happened in the background🌻</h2>
      <div class={`grid`} style={{ gap: "8px", fontSize: "18px" }}>
        <div>Unfortunately, we couldn't send you a reset email.</div>
        <div>Please try again in a bit.</div>
      </div>
    </div>
  )
})
