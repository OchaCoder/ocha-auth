import { type Ctr } from "../../contexts/ContextGlobalState"
import { addToast } from "../toast-manager"
import { isConfirmedValueMatching, isEmailValid, isInputEmpty, isNameValid, isPasswordValid } from "./common/validators"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Validates a group of inputs and returns a set of actions to:
 * - Check for empty values
 * - Check for valid format
 * - Trigger visual jiggle feedback on invalid fields
 *
 * This is not a real-time validator — it's designed to run once upon form submission.
 *
 * @param ctr - Qwik global controller for triggering UI effects
 * @param target - The input values and flags to validate
 * @returns A set of helper methods: `jiggleInputOnError`, `showToast `, `checkEmpty`, `checkFormat`
 */
export const onSubmitInputChecker = async (
  ctr: Ctr,
  target: {
    name?: { value: string; fx: boolean }
    email?: { value: string; fx: boolean }
    password?: { value: string; valueConfirm: string; fx: boolean }
  } | null = null
) => {
  if (!target) return { jiggleInputOnError: () => {}, showToast: () => {}, checkEmpty: () => false, checkFormat: () => false }

  type Candidate = keyof typeof target
  const keysOfTargetObj = Object.keys(target)

  const errorCounter = { empty: 0, invalid: 0 }
  const jiggleArray: string[] = []
  const toastArray: string[] = []

  for (const candidate of keysOfTargetObj) {
    switch (candidate as Candidate) {
      case "name": {
        const value = target.name!.value!
        if (isInputEmpty(value)) {
          jiggleArray.push("name")
          toastArray.push("Name is empty.")

          errorCounter.empty++
        }
        if (!isNameValid(value)) {
          jiggleArray.push("name")
          toastArray.push("Name is in the wrong format.")

          errorCounter.invalid++
        }

        break
      }
      case "email": {
        const value = target.email!.value!
        if (isInputEmpty(value)) {
          jiggleArray.push("email")
          toastArray.push("Email is empty.")

          errorCounter.empty++
        }
        if (!isEmailValid(value)) {
          toastArray.push("Email is in the wrong format.")
          jiggleArray.push("email")
          errorCounter.invalid++
        }
        break
      }
      case "password": {
        const value = target.password!.value
        const valueConfirm = target.password!.valueConfirm
        if (isInputEmpty(value)) {
          toastArray.push("Password is empty.")
          jiggleArray.push("password")
          errorCounter.empty++
        }
        if (!isPasswordValid(value)) {
          toastArray.push("Password is in the wrong format.")
          jiggleArray.push("password")
          errorCounter.invalid++
        }
        if (!isConfirmedValueMatching(value, valueConfirm)) {
          toastArray.push("Password is not matching.")
          jiggleArray.push("password")
          errorCounter.invalid++
        }
        break
      }
    }
  }

  /**
   * Jiggles the input field for 500ms that had error.
   */
  const jiggleInputOnError = async () => {
    if (jiggleArray.includes("name")) target.name!.fx = true
    if (jiggleArray.includes("email")) target.email!.fx = true
    if (jiggleArray.includes("password")) target.password!.fx = true
    await delay(500)
    if (jiggleArray.includes("name")) target.name!.fx = false
    if (jiggleArray.includes("email")) target.email!.fx = false
    if (jiggleArray.includes("password")) target.password!.fx = false

    jiggleArray.length = 0
  }

  /**
   * Shows the toast messages with 400ms delay.
   */
  const showToast = async () => {
    for (const toastMessage of toastArray) {
      addToast(ctr.toast, "yellow", toastMessage)
      await delay(400)
    }
  }

  /**
   * Returns true only if all inputs are filled.
   */
  const checkEmpty = () => {
    if (errorCounter.empty === 0) return true
    return false
  }

  /**
   * Returns true only if all inputs match the expected formats.
   */
  const checkFormat = () => {
    if (errorCounter.invalid === 0) return true
    return false
  }

  return { jiggleInputOnError, showToast, checkEmpty, checkFormat }
}
