// Websafe token encoder
export const webSafeBtoA = (tokenOriginal: string): string => {
  // Replaces '+' with '-',
  // Replaces '/' with '_',
  // Replaces '=' at the end with ''.

  let tokenWebSafe = btoa(tokenOriginal).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

  return tokenWebSafe
}

// Websafe token decoder
export const webSafeAtoB = (tokenWebSafe: string): string => {
  // Add padding so Base64 works correctly
  const pad = "=".repeat((4 - (tokenWebSafe.length % 4)) % 4) // figure out how many `=` we need to pad

  // Undo the friendly characters we used to make it URL-safe."
  const base64 =
    tokenWebSafe
      .replace(/-/g, "+") // turn all - into +
      .replace(/_/g, "/") + // turn all _ into /
    pad
  const tokenOriginal = atob(base64)

  return tokenOriginal
}
