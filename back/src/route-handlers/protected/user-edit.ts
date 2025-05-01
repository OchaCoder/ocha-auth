import { FastifyReply } from "fastify"
import { ProtectedFastify, ProtectedRequest } from "../../type.js"
import { PgDataUserEditValidator as Validator } from "../../validators.js"
import { runPg } from "../../functions/helpers/run-pg/index.js"
import { ErrorSuspiciousActivity } from "../../error-classes/error-suspicious-activity.js"
import { requireUserId } from "../../functions/helpers/require/require-user-id.js"

export const userEdit = (fastify: ProtectedFastify) => {
  return async (request: ProtectedRequest, reply: FastifyReply) => {
    // 1. Extract id from request body
    const id = requireUserId(request)

    // 2. Get user data
    const query = `SELECT name, email FROM users WHERE id = $1;`
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
      },
      sideEffects: {
        cookie: { hasData: false, data: null },
        devNotes: ["Loading protected static data - Edit page"],
      },
    })
  }
}
