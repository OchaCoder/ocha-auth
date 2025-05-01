import { RequestHandler } from "@builder.io/qwik-city"

// This plugin checks for 'mode' in the cookie, and applys the correct mode if available.

// export const onGet: RequestHandler = async ({ cookie, sharedMap }) => {
//   console.log("dark mode plugin is fired")
//   const mode = cookie.get("mode")?.value
//   if (mode === "dark") sharedMap.set("mode", true)
//   else sharedMap.set("mode", false)
// }
