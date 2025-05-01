import { $, component$, useContext } from "@builder.io/qwik"
import { ContextIdGlobalState } from "../../contexts/ContextGlobalState"
import { IconDarkMode, IconLightMode } from "../Miscs/Icons"
import { setCookieFromClient } from "../../helper-functions/set-cookie-helpers"

const dimension = { w: 54, h: 26, ballW: 20, ballPad: 4 }
export const DarkModeButton = component$(() => {
  const { ctr } = useContext(ContextIdGlobalState)

  return (
    <>
      <div class="flex" style={{ gap: "5px" }}>
        <div
          class="flex items-center cursor-pointer"
          style={{
            position: `relative`,
            backgroundColor: `var(--theme)`,
            width: `${dimension.w}px`,
            height: `${dimension.h}px`,
            borderRadius: `${dimension.ballW}px`,
          }}
          onClick$={$(() => {
            ctr.darkMode = !ctr.darkMode
            setCookieFromClient("mode", `${ctr.darkMode ? "dark" : "light"}`, 60 * 60 * 24 * 365)
          })}>
          <div
            style={{
              position: `absolute`,
              backgroundColor: `var(--dual-light)`,
              borderRadius: `${dimension.ballW}px`,
              width: `${dimension.ballW}px`,
              height: `${dimension.ballW}px`,
              translate: ctr.darkMode ? `${dimension.w - dimension.ballW - dimension.ballPad}px 0px` : `${dimension.ballPad}px 0px`,
              transition: `translate 200ms ease-in-out, background-color 300ms ease-out`,
            }}></div>
        </div>
        {ctr.darkMode ? <IconDarkMode fill={`var(--theme)`} /> : <IconLightMode fill={`var(--theme)`} />}
      </div>
    </>
  )
})
