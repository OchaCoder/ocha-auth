import { component$ } from "@builder.io/qwik"
import { height } from "../routes/layout"
import { UserGreeting } from "./Header/UserGreeting"
import { AuthPortal } from "./AuthPortal/AuthPortal"

export const Home = component$(() => {
  return (
    <>
      <UserGreeting height={height.greeting} />
      <div class="flex items-center justify-center" style={{ minHeight: `calc(100vh - ${height.header + height.greeting}px)` }}>
        <AuthPortal />
      </div>
    </>
  )
})
