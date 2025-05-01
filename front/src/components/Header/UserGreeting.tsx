import { component$, useContext } from "@builder.io/qwik"
import { ContextIdGlobalState } from "../../contexts/ContextGlobalState"

import { txtGeneral } from "../../texts"
import { Link } from "@builder.io/qwik-city"

export const UserGreeting = component$(({ height }: { height: number }) => {
  const { userState } = useContext(ContextIdGlobalState)
  return (
    <div class="flex justify-end items-center italic" style={{ height: `${height}px`, paddingRight: "10px" }}>
      {userState.name.length > 0 ? (
        <>
          <span>{txtGeneral.greetingUser}&nbsp;</span>
          <span class="color-theme">
            <Link href="/account/dashboard" prefetch={false}>
              {userState.name}
            </Link>
          </span>
        </>
      ) : (
        <span>{txtGeneral.greetingGuest}</span>
      )}
    </div>
  )
})
