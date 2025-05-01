import { ErrorDefensiveGuardBreach } from "../../error-classes/error-defensive-guard-breach.js"

export const resloveObfuscatedEmailFromEmail = (email: string): string => {
  const [local, domain] = email.split("@")

  if (!local || !domain)
    throw new ErrorDefensiveGuardBreach("ERR_EMAIL_FORMAT_INVALID", "Provided email did not have a valid shape. Possibly a bug if this email is not directly derived from an user input.", {
      functionName: "resloveObfuscatedEmailFromEmail",
      specialJson: email,
      debug: email,
    })

  let obfuscatedLocal = ""

  if (local.length <= 2) {
    obfuscatedLocal = local[0] + "*"
  } else if (local.length <= 4) {
    obfuscatedLocal = local[0] + "*".repeat(local.length - 1)
  } else {
    obfuscatedLocal = local.slice(0, 2) + "*".repeat(local.length - 4) + local.slice(-2)
  }

  return `${obfuscatedLocal}@${domain}`
}
