import { FormatRegistry, Type } from "@sinclair/typebox"
import { TypeCompiler } from "@sinclair/typebox/compiler"

// Register the email format
FormatRegistry.Set("email", (value) => {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
})

export const ValidateEmail = TypeCompiler.Compile(Type.String({ format: "email" }))
