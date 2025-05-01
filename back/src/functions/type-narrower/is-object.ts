/**
 * Part of the `type-narrower` family — checks whether a value is of type `object`.
 *
 * This helper enables strong type narrowing with full type inference for the caller.
 *
 * @param value - The unknown input to check
 * @returns `true` if the value is an object, with narrowed type assertion.
 */
export const isObject = (value: unknown): value is object => {
  return typeof value === "object"
}
