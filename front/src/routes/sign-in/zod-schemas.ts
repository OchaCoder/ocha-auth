import { z } from "@builder.io/qwik-city"
import { outputActionErrorSchema } from "../zod-schema"
import { inputCheckPasswordSchema } from "~/components/AuthPortal/Parts/zod-schema"

// Action Input @useUserSignInAction
export const requestUserSignInrSchema = z.object({
  email: z.string().email(),
  password: inputCheckPasswordSchema,
  bid: z.string(),
})

// Action Output @useUserSignInAction
export const outputUserSignInActionSchema = z.discriminatedUnion("success", [
  outputActionErrorSchema,
  z.object({
    success: z.literal(true),
    payload: z.object({ userName: z.string() }),
    errorAction: z.object({}),
  }),
])
