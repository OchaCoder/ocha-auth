import { z } from "@builder.io/qwik-city"

const envSchema = z.object({
  FRONTEND_URL: z.string(),
  BACKEND_URL: z.string(),
  ERRCATCHER_URL: z.string(),
})

export const configPublic = envSchema.parse({
  FRONTEND_URL: import.meta.env.PUBLIC_FRONTEND_URL,
  BACKEND_URL: import.meta.env.PUBLIC_BACKEND_URL,
  ERRCATCHER_URL: `${import.meta.env.PUBLIC_FRONTEND_URL}/errcatcher`,
})
