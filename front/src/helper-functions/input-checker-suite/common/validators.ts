import { passwordRegex } from "./regex"
import { ValidateEmail } from "./typebox-validator"

export const isInputEmpty = (value: unknown): boolean => {
  if (typeof value !== "string") return true
  if (value === "") return true
  return false
}
export const isNameValid = (value: unknown): boolean => {
  if (typeof value !== "string") return false
  if (value.length < 2) return false
  return true
}
export const isEmailValid = (value: unknown): boolean => {
  if (!ValidateEmail.Check(value)) return false
  return true
}
export const isPasswordValid = (value: unknown): boolean => {
  if (typeof value !== "string") return false
  if (value.length < 8) return false

  if (!passwordRegex.hasLetter.test(value)) return false

  if (!passwordRegex.hasNumber.test(value)) return false

  if (!passwordRegex.hasSpecial.test(value)) return false

  return true
}
export const isConfirmedValueMatching = (value: unknown, valueConfirm: unknown): boolean => {
  if (value !== valueConfirm) return false
  return true
}
