import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { ValidatorRedisRpt } from "../../validators.js"
import { runRedis } from "../../functions/helpers/run-redis/index.js"
import { Static, Type } from "@sinclair/typebox"
import { resloveObfuscatedEmailFromEmail } from "../../functions/resolvers/resolve-obfuscated-email-from-email.js"
import { resolveRptObjFromRptObjV4Websafe } from "../../functions/resolvers/resolve-rpt-obj-from-rpt-obj-v4-websafe.js"

export const RedisRptSchema = Type.Object({
  isUsed: Type.Boolean(),
})
export type RedisRpt = Static<typeof RedisRptSchema>

// Request body @userResetPasswordVerifyToken
export const UserResetPasswordVerifyTokenSchema = Type.Object({
  payload: Type.Object({
    hasData: Type.Literal(true),
    data: Type.Object({
      rpt: Type.String(),
    }),
  }),
})
export type UserResetPasswordVerifyToken = Static<typeof UserResetPasswordVerifyTokenSchema>

export const userResetPasswordVerifyToken = (fastify: FastifyInstance) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { rpt } = (request.body as UserResetPasswordVerifyToken).payload.data

    // 1. Rename for convenience
    const rptObjV4Websafe = rpt

    // 2. Decode, decrypt and parse to reslove the `rptObj.
    // Returns `{ success: false, code: "ERR_RPT_EXPIRED" }` if `rptObjV4` is found expired.
    const validatedRptObj = await resolveRptObjFromRptObjV4Websafe(reply, rptObjV4Websafe, `expect::rptV4Websafe::${rptObjV4Websafe}`)

    const validatedRpt = validatedRptObj.rpt

    // 3. Use `validatedRpt` to fetch `{ v4 : string; isUsed : boolean }` object.
    const validatedRedisData = await runRedis.get.obj(fastify, `reset:${validatedRpt}`, `id::${validatedRptObj.id}`, ValidatorRedisRpt)

    // 4. At this point, the `rptV4` has already passed `V4.verify` check.
    // But because Redis TTL is set to always live 10 seconds shorter than the `rptObjV4`, this check can still naturally happen.
    // Also, once the Redis is updated with `{ isUsed : true }`, the remaining TTL becomes 10 seconds.
    if (validatedRedisData === null) return reply.status(401).send({ success: false, code: "ERR_RPT_EXPIRED" })

    // 5. Check if the token has been used before.
    if (validatedRedisData.isUsed) return reply.status(403).send({ success: false, code: "ERR_RPT_IS_USED" })

    // 6. Update Redis flag as `{ isUsed: true }`, and set the TTL to expire in 10 seconds.
    runRedis.fireAndForget(fastify, async () => await fastify.redis.set(`reset:${validatedRpt}`, JSON.stringify({ isUsed: true }), "EX", 10), `id::${validatedRptObj.id}`) // Expires in 10 seconds.

    // 7. Obfuscate `email` before sending it out to the frontend.
    const obfuscatedEmail = resloveObfuscatedEmailFromEmail(validatedRptObj.email)

    // 12. Send reply
    reply.code(200).send({
      success: true,
      data: { rpt, obfuscatedEmail },
      sideEffects: {
        cookie: { hasData: false, data: null },
        devNotes: ["General action - The returned reset password token via email link is verified."],
      },
    })
  }
}
