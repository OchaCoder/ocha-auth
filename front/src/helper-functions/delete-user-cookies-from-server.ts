import { RequestEventAction, RequestEventLoader } from "@builder.io/qwik-city"

export const deleteUserCookiesFromServer = (ev: RequestEventAction | RequestEventLoader) => {
  ev.cookie.delete("at", { path: "/" })
  ev.cookie.delete("bid", { path: "/" })
  ev.cookie.delete("uid", { path: "/" })
}
