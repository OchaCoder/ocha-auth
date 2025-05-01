import { FastifyReply } from "fastify"
import { ProtectedFastify, ProtectedRequest } from "../../type.js"
import { requireUserId } from "../../functions/helpers/require/require-user-id.js"

import { runRedis } from "../../functions/helpers/run-redis/index.js"
import { Static, Type } from "@sinclair/typebox"
import { validateBrowserId } from "../../functions/helpers/validators/validate-browser-id.js"

// Expected request body of this route
export const RequestBodyUserSignOutFromOneSchema = Type.Object({
  at: Type.String(),
  payload: Type.Object({
    hasData: Type.Literal(true),
    data: Type.Object({
      bid: Type.String(),
    }),
  }),
})

export const userSignOutFromOne = (fastify: ProtectedFastify) => {
  return async (request: ProtectedRequest, reply: FastifyReply) => {
    // 1. Extract id from request body
    const id = requireUserId(request)

    // 2. Extract bid from request body. Required to find and delete only the specific refresh token.
    const { bid } = (request.body as Static<typeof RequestBodyUserSignOutFromOneSchema>).payload.data

    // 3. Validate the shape of `bid`
    const validatedBid = validateBrowserId(bid, `id::${id}`)

    // 4. Delete user from Redis
    await runRedis.fireAndForget(
      fastify,
      async () => {
        fastify.redis.getdel(`browserID:${validatedBid}`) // Remove one `rt` from Redis, using corresponding `bid`.

        fastify.redis.zrem(`user:${id}:browsers`, validatedBid) // Remove one `bid` from Redis Set storing all `bid` of this user.
      },
      id
    )

    // 5. Send reply
    reply.code(200).send({
      success: true,
      data: null,
      sideEffects: {
        cookie: { hasData: false, data: null },
        devNotes: ["Protected action - User is signing out from the current browser."],
      },
    })
  }
}
