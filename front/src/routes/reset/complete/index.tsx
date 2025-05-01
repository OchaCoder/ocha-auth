import { $, component$, isBrowser, useOnWindow, useSignal, useTask$ } from "@builder.io/qwik"
import { Link, useNavigate } from "@builder.io/qwik-city"

export default component$(() => {
  const countDown = useSignal(10)
  const nav = useNavigate()

  // Redirect anyone who tries to access this route directly.
  useOnWindow(
    "load",
    $(() => nav("/"))
  )

  useTask$(() => {
    if (isBrowser) {
      const interval = setInterval(() => {
        if (countDown.value > 0) {
          countDown.value--
        } else {
          clearInterval(interval)
          nav("/sign-in")
        }
      }, 1000)
    }
  })
  return (
    <div class={`grid justify-center`} style={{ padding: "30px", gap: "30px" }}>
      <h2 class="grid justify-center font-size-13">Your password was updated successfully.</h2>
      <div>
        <div style={{ paddingBottom: "10px" }}>
          Please{" "}
          <Link class={`color-theme`} href={`/sign-in`}>
            sign-in
          </Link>{" "}
          with your new password!
        </div>
        <span>{`We will redirect you to signin page in `}</span>
        <span class={`color-theme`}>{countDown.value}</span>
        <span>{` second.`}</span>
      </div>
      <div>
        Click{" "}
        <Link class={`color-theme`} href={`/sign-in`}>
          here
        </Link>{" "}
        to go to sign-in page now.
      </div>
    </div>
  )
})
