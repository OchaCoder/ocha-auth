import { component$, useContext } from "@builder.io/qwik"
import { IconCheckCircle, IconWarning } from "./Icons"
import { ContextIdGlobalState } from "../../contexts/ContextGlobalState"

// Shows green alert when connection is back.
const Recovered = component$(() => {
  const { stable, suppressGreen } = useContext(ContextIdGlobalState).backendHealth

  return (
    <div class={`backend-recovered ${stable && !suppressGreen && `show`}`}>
      <div class={`flex items-center justify-center`}>
        <IconCheckCircle size={34} />
        <h2 style={{ paddingLeft: "6px", fontWeight: 600, fontSize: "1.2rem" }}>Connection is back up!</h2>
      </div>
    </div>
  )
})

// Shows red alert when connection is down.
const Down = component$(() => {
  const { stable } = useContext(ContextIdGlobalState).backendHealth
  return (
    <div class={`backend-down ${!stable && `show`}`}>
      <div class={`flex items-center justify-center`} style={{ paddingBottom: "10px" }}>
        <div class={`icon-jiggle`}>
          <IconWarning size={34} />
        </div>
        <h2 style={{ paddingLeft: "6px", fontWeight: 600, fontSize: "1.2rem" }}>Temporary connection issue</h2>
      </div>
      <div class={`grid`} style={{ gap: "5px" }}>
        <div> Saving and updating are currently on a short break.</div>
        <div> We'll be back soon!</div>
      </div>
    </div>
  )
})

export const BackendDownWarning = component$(() => {
  return (
    <>
      <Down />
      <Recovered />
    </>
  )
})
