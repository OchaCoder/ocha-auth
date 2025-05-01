import { component$, useContext } from "@builder.io/qwik"
import { DarkModeButton } from "./DarkModeButton"
import { txtHeader } from "../../texts"
import { Link } from "@builder.io/qwik-city"
import { ContextIdGlobalState } from "~/contexts/ContextGlobalState"

export const Header = component$(({ height }: { height: number }) => {
  const { ctr } = useContext(ContextIdGlobalState)
  return (
    <div class="flex items-center" style={{ position: `relative`, gap: `1rem`, padding: `0 10px`, height: `${height}px`, width: "100%", borderBottom: `var(--theme) 4px solid` }}>
      <div class="flex" style={{ flex: 1, justifyContent: `start` }}>
        <h1 class="font-size-16 weight-700" style={{ color: `var(--theme)` }}>
          <Link href="/" onClick$={() => (ctr.authCode = "SIGN_IN")}>
            {txtHeader.title}
          </Link>
        </h1>
      </div>
      <DarkModeButton />
    </div>
  )
})
