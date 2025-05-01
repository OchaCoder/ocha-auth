/**
 * Part of the `type-narrower` family — checks whether a value is of type `number`.
 *
 * This helper enables strong type narrowing with full type inference for the caller.
 *
 * @param value - The unknown input to check
 * @returns `true` if the value is a number, with narrowed type assertion.
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === "number"
}
