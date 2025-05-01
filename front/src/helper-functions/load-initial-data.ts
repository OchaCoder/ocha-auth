import { $ } from "@builder.io/qwik"
import { server$ } from "@builder.io/qwik-city"
import { setCookieFromServer } from "./set-cookie-helpers"

export const loadMode = $(
  server$(function () {
    if (this.cookie.get("mode")?.value === "dark") return true
    else return false
  })
)
export const loadUserName = $(
  server$(function () {
    const uid = this.cookie.get("uid")?.value
    if (uid) {
      // 1. Reset maxAge of uid
      const maxAge = 60 * 60 * 24 * 30 * 6 // Half a year
      setCookieFromServer(this.cookie, "uid", uid, maxAge)

      // 2. Decode userName from uid and return
      return atob(uid)
    } else return ""
  })
)
