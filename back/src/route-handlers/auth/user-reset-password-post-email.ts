import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import argon2 from "argon2"
import { config } from "../../config.js"
import { ErrorSuspiciousActivity } from "../../error-classes/error-suspicious-activity.js"
import { runPg } from "../../functions/helpers/run-pg/index.js"
import { Static, Type } from "@sinclair/typebox"
import { resolveRptObjFromRptObjV4Websafe } from "../../functions/resolvers/resolve-rpt-obj-from-rpt-obj-v4-websafe.js"

// Request body @userResetPasswordPostEmail
export const UserResetPasswordPostEmailSchema = Type.Object({
  payload: Type.Object({
    hasData: Type.Literal(true),
    data: Type.Object({
      password: Type.String(),
      rpt: Type.String(),
    }),
  }),
})
export type UserResetPasswordSchemaPostEmail = Static<typeof UserResetPasswordPostEmailSchema>

export const userResetPasswordPostEmail = (fastify: FastifyInstance) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { password, rpt } = (request.body as UserResetPasswordSchemaPostEmail).payload.data

    // 1. Rename it for convenience
    const rptObjV4Websafe = rpt

    // 2. Decode, decrypt and parse to reslove the `rptObj.
    // Returns `{ success: false, code: "ERR_RPT_EXPIRED" }` if `rptObjV4` is found expired.
    const { id: userId } = await resolveRptObjFromRptObjV4Websafe(reply, rptObjV4Websafe, `expect::rptV4Websafe::${rptObjV4Websafe}`)

    // 3. The user is legit. Hash user password.
    const newHashedPassword = await argon2.hash(password, config.argon2Config)

    // 4. Store the new hashed-password in Postgres.
    const query = `UPDATE users SET hashed_password = $1 WHERE id = $2`
    const values = [newHashedPassword, userId]

    const resultBool = await runPg.bool.modify(fastify, query, values, userId)

    // 5. This is unlikely due to the very short time window (180 seconds), but not impossible.
    if (!resultBool)
      throw new ErrorSuspiciousActivity(
        "ERR_USER_VANISHED_MID_OPERATION",
        `User requested a password reset email, then vanished, then continued to update password. Possibly exploratory, tampering, or replay attack.`,
        {
          identity: `${userId}`,
        }
      )

    // 6. Send reply
    reply.code(200).send({
      success: true,
      data: null,
      sideEffects: {
        cookie: { hasData: false, data: null },
        devNotes: ["General action - User has updated the password via reset password token sent by email."],
      },
    })
  }
}
