import { $ } from "@builder.io/qwik"
import { Ctr } from "../../contexts/ContextGlobalState"
import { passwordRegex } from "./common/regex"

export const passwordChecker = $((ctr: Ctr, input: string) => {
  const hasLength = input.length > 8
  const hasLetter = passwordRegex.hasLetter.test(input)
  const hasNumber = passwordRegex.hasNumber.test(input)
  const hasSpecial = passwordRegex.hasSpecial.test(input)

  hasLength ? (ctr.passwordGuide.hasLength = true) : (ctr.passwordGuide.hasLength = false)
  hasLetter ? (ctr.passwordGuide.hasLetter = true) : (ctr.passwordGuide.hasLetter = false)
  hasNumber ? (ctr.passwordGuide.hasNumber = true) : (ctr.passwordGuide.hasNumber = false)
  hasSpecial ? (ctr.passwordGuide.hasSpecial = true) : (ctr.passwordGuide.hasSpecial = false)

  return hasLength && hasLetter && hasNumber && hasSpecial
})
