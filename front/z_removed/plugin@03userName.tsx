// import { RequestHandler } from "@builder.io/qwik-city"
// import { setCookieFromServer } from "../src/helperFunctions/setCookieHelpers"

// This plugin checks for "uid" in the cookie, and set's user name if available.

// export const onGet: RequestHandler = async ({ cookie, sharedMap }) => {
//   // 1: Check UID
//   const uid = cookie.get("uid")?.value

//   if (!uid) return

//   // 2: Reset maxAge of UID
//   const maxAge = 60 * 60 * 24 * 30 * 6 // Half a year
//   setCookieFromServer(cookie, "uid", uid, maxAge)

//   // 3: Updated sharedMap
//   const userName = atob(uid)
//   sharedMap.set("userName", userName) // Scoped to a single HTTP request
// }
