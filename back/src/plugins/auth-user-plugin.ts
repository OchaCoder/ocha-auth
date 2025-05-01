import fp from "fastify-plugin"
import { FastifyPluginAsync, FastifyReply } from "fastify"
import { userDashboard } from "../route-handlers/protected/user-dashboard.js"
import { userEdit } from "../route-handlers/protected/user-edit.js"
import { userDelete } from "../route-handlers/protected/user-delete.js"
import { RequestBodyUserUpdateSchema, userUpdate } from "../route-handlers/protected/user-update.js"
import { userSignOutFromAll } from "../route-handlers/protected/user-signout-from-all.js"
import { RequestBodyUserSignOutFromOneSchema, userSignOutFromOne } from "../route-handlers/protected/user-signout-from-one.js"
import { ProtectedFastify, ProtectedRequest } from "../type.js"
import { resolveUserIdFromAccessToken } from "../functions/resolvers/resolve-user-id-from-access-token.js"
import { ProtectedPayloadHasDataFalseSchema } from "../server.js"

// 1: DRY Approach
// Use this approach if you value flexibility, reusability, and a clear separation of authentication logic from route definitions.
// This is suitable for larger-scale projects that require consistent authentication across multiple routes.
export const authUserPluginDry: FastifyPluginAsync = fp(async (fastify: ProtectedFastify, _options) => {
  fastify.decorateRequest("user", null)
  fastify.addHook("preHandler", async (request: ProtectedRequest, reply: FastifyReply) => {
    // 1. Extract the access token from request body

    const { at } = request.body as { at: string }

    // 2. Validate, verify and parse the acces token to get user ID. Throw appropriate error at different stages.
    const id = await resolveUserIdFromAccessToken(reply, at, `accessToken::at`)

    // 3. Attach user ID to request object
    request.user = { id }
  })
})

// 2: Modular Approach
// Use this approach if you value self-contained modules that encapsulate both authentication and related routes together.
// This approach provides better local cohesion, making it easier to understand in smaller contexts.
export const authUserPluginModular: FastifyPluginAsync = fp(async (fastify, _options) => {
  fastify.decorateRequest("user", null)
  fastify.register(
    async (protectedFastify) => {
      protectedFastify.addHook("preHandler", async (request: ProtectedRequest, reply: FastifyReply) => {
        // 1: Extract AT from request body
        const { at } = request.body as { at: string }

        // 2: Verify AT
        const id = await resolveUserIdFromAccessToken(reply, at, `accessToken::at`)

        // 3: Attach user ID to request object
        request.user = { id }
      })

      protectedFastify.post("/dashboard", { schema: { body: ProtectedPayloadHasDataFalseSchema } }, userDashboard(protectedFastify))
      protectedFastify.post("/edit", { schema: { body: ProtectedPayloadHasDataFalseSchema } }, userEdit(protectedFastify))
      protectedFastify.post("/delete", { schema: { body: ProtectedPayloadHasDataFalseSchema } }, userDelete(protectedFastify))
      protectedFastify.post("/update", { schema: { body: RequestBodyUserUpdateSchema } }, userUpdate(protectedFastify))
      protectedFastify.post("/signout-from-all", { schema: { body: ProtectedPayloadHasDataFalseSchema } }, userSignOutFromAll(protectedFastify))
      protectedFastify.post("/signout-from-one", { schema: { body: RequestBodyUserSignOutFromOneSchema } }, userSignOutFromOne(protectedFastify))
    },
    { prefix: "/protected" }
  )
})
