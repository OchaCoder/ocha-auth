import { component$, useContext } from "@builder.io/qwik"
import { Link } from "@builder.io/qwik-city"
import { ContextIdGlobalState } from "~/contexts/ContextGlobalState"

export default component$(() => {
  const { userState } = useContext(ContextIdGlobalState)

  return (
    <div class={`grid justify-center`} style={{ padding: "30px", gap: "30px" }}>
      <h2 class="grid justify-center font-size-14 color-theme">Please check your inbox!</h2>
      <div class={`grid`} style={{ gap: "8px", fontSize: "18px" }}>
        <div>If this email exists in our system, a reset link is on its way!</div>

        <div>
          To help protect your account, you have <span style="color: lightgreen">180 seconds</span> to click the link and finish resetting your password.
        </div>

        <div>You can now safely close this tab!</div>
      </div>
      <div>
        <h3 class={`grid justify-center color-theme`} style={{ paddingBottom: "10px" }}>
          Can't find the email?
        </h3>
        <div class={`grid`} style={{ gap: "8px" }}>
          <div>Please make sure again that the submitted email matches with your inbox.</div>
          <div>
            Your input was... <span style={{ color: "lightgreen" }}>{userState.email}</span>
          </div>
          <div>Also, please check your spam box, just in case!</div>
        </div>
      </div>
      <div>
        <h3 class={`grid justify-center color-theme`} style={{ paddingBottom: "10px" }}>
          Want to resend the link?
        </h3>
        <div class={`grid`} style={{ gap: "6px" }}>
          <div>
            You can do so after a while from <Link href="/reset/request/">here</Link>!
          </div>
        </div>
      </div>
    </div>
  )
})
