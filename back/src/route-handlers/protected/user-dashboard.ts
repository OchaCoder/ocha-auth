import { FastifyReply } from "fastify"
import { PgDataATVerifiedUserValidator as Validator } from "../../validators.js"
import { ProtectedFastify, ProtectedRequest } from "../../type.js"
import { requireUserId } from "../../functions/helpers/require/require-user-id.js"
import { runPg } from "../../functions/helpers/run-pg/index.js"
import { ErrorSuspiciousActivity } from "../../error-classes/error-suspicious-activity.js"

export const userDashboard = (fastify: ProtectedFastify) => {
  return async (request: ProtectedRequest, reply: FastifyReply) => {
    // 1. Extract id from request body
    const id = requireUserId(request)

    // 2. Get user based on id.
    const query = `SELECT name, email, created_at, last_modified_at FROM users WHERE id = $1 LIMIT 1;`
    const validatedData = await runPg.query.obj(fastify, query, [id], id, Validator)

    // 3. Sanity check – Structurally valid, logically impossible
    if (validatedData === null)
      throw new ErrorSuspiciousActivity("ERR_USER_VANISHED_DURING_LOAD", `Expected user vanished during page load. Possibly stale session, tampering or replay attack.`, {
        identity: `${id}`,
      })

    // 4. Send reply
    reply.code(200).send({
      success: true,
      data: {
        name: validatedData.name,
        email: validatedData.email,
        createdAt: validatedData.created_at,
        lastModifiedAt: validatedData.last_modified_at,
      },
      sideEffects: {
        cookie: { hasData: false, data: null },
        devNotes: ["Loading protected static data - Dashboard page"],
      },
    })
  }
}
