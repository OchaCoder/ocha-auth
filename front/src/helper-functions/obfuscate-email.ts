export const obfuscateEmail = (email: string): string => {
  const [local, domain] = email.split("@")

  if (!local || !domain) return email // Fallback if it's not valid

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
