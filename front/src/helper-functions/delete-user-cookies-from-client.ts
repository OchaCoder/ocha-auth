import { server$ } from "@builder.io/qwik-city"

export const deleteUserCookiesFromClient = server$(async function () {
  this.cookie.delete("at", { path: "/" })
  this.cookie.delete("bid", { path: "/" })
  this.cookie.delete("uid", { path: "/" })
})
