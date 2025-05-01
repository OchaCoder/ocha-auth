import { z } from "@builder.io/qwik-city"

const envSchema = z.object({
  BACKEND_URL: z.string(),
})

export const configPublic = envSchema.parse({
  BACKEND_URL: import.meta.env.PUBLIC_BACKEND_URL,
})
