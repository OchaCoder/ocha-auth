import { component$ } from "@builder.io/qwik"

export default component$(() => {
  return (
    <div class={`grid justify-center`} style={{ padding: "30px", gap: "30px" }}>
      <h2 class="grid justify-center font-size-14 color-theme">You link has expired, or has been used.🌻</h2>
      <div class={`grid`} style={{ gap: "8px", fontSize: "18px" }}>
        <div>We couldn't reset your password.</div>
        <div>Please try again from the begining.</div>
      </div>
    </div>
  )
})
