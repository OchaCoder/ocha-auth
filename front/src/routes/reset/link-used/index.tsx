import { $, component$, useOnWindow } from "@builder.io/qwik"
import { Link, useNavigate } from "@builder.io/qwik-city"

export default component$(() => {
  const nav = useNavigate()

  //   This page should only reached via within-site navigation.
  //   Direct access should be redirected immedietely.
  // useOnWindow(
  //   "load",
  //   $(() => {
  //     nav("/")
  //   })
  // )

  return (
    <div class={`grid justify-center`} style={{ padding: "30px", gap: "30px" }}>
      <h2 class="grid justify-center font-size-14 color-theme">Your link has already been used.</h2>
      <div class={`grid`} style={{ gap: "8px", fontSize: "18px" }}>
        <div>
          Please try again with a new <Link href="/reset/request/">link</Link>!
        </div>
      </div>
    </div>
  )
})
