import { component$ } from "@builder.io/qwik"
import { Link } from "@builder.io/qwik-city"

export default component$(() => {
  return (
    <div class={`grid justify-center`} style={{ padding: "30px", gap: "30px" }}>
      <h2 class="grid justify-center font-size-14 color-theme">Your link is expired.</h2>
      <div class={`grid`} style={{ gap: "8px", fontSize: "18px" }}>
        <div>
          Please try again with a new <Link href="/reset/request/">link</Link>!
        </div>
      </div>
    </div>
  )
})
