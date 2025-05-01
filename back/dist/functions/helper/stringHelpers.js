// import { String } from "@sinclair/typebox"
// // import ms from "ms"
export {};
// export const generateRandomString = () => {
//   // This helper function creates a random string of arbitrary number of characters.
//   const randomStringLength = 16
//   const choices = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
//   let string = ""
//   for (let i = 0; i < randomStringLength; i++) {
//     const randomIndex = Math.floor(Math.random() * choices.length)
//     string += choices.charAt(randomIndex)
//   }
//   return string
// }
// // export const generateBase64FromTimeStamp = (timestamp:string) => {
// //   let timestampInMs
// //   if (!timestamp) timestampInMs = Date.now() as number// Current timestamp in milliseconds
// //   else timestampInMs = new Date(timestamp).getTime().toString() // Converts timestamp to milliseconds
// //   const timeStampInBase64 = Buffer.from(timestampInMs).toString("base64") // Convert to Base64 (Leaves "==" at the end.)
// //   const base64url = timeStampInBase64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") // Convert to Base64url encoding (No more "==").
// //   return base64url
// // }
// export const convertExpirationTimestampToCookieMaxAge = (timestamp: string) => {
//   const msConversion = new Date(timestamp).getTime()
//   const currentTime = Date.now() //
//   const maxAge = Math.floor((msConversion - currentTime) / 1000) // Calculate maxAge in seconds and round it
//   return maxAge
// }
