import fp from "fastify-plugin";
import { atVerifier } from "../functions/helper/atVerifier.js";
import { userDashboard } from "../route-handlers/protected/user-dashboard.js";
import { atSchema, UserSignOutFromOneSchema, UserUpdateSchema } from "../schema.js";
import { userEdit } from "../route-handlers/protected/user-edit.js";
import { userDelete } from "../route-handlers/protected/user-delete.js";
import { userUpdate } from "../route-handlers/protected/user-update.js";
import { userSignOutFromAll } from "../route-handlers/protected/user-signout-from-all.js";
import { userSignOutFromOne } from "../route-handlers/protected/user-signout-from-one.js";
import { playWithErrors } from "../route-handlers/playWithErrors.js";
// 1: DRY Approach:
// Use this approach if you value flexibility, reusability, and a clear separation of authentication logic from route definitions.
// This is suitable for larger-scale projects that require consistent authentication across multiple routes.
export const authUserPluginDry = fp(async (fastify, _options) => {
    fastify.decorateRequest("user", null);
    fastify.addHook("preHandler", async (request, _reply) => {
        // 1: Extract AT from request body
        const { at } = request.body;
        // 2: Validate AT format
        if (!at.startsWith("v4.public."))
            throw new Error("ERR_AT_INVALID_FORMAT");
        // 3: Verify AT
        const data = await atVerifier(at);
        // 4: Attach user ID to request object
        request.user = { id: data };
    });
});
// 2: Modular Approach:
// Use this approach if you value self-contained modules that encapsulate both authentication and related routes together.
// This approach provides better local cohesion, making it easier to understand in smaller contexts.
export const authUserPluginModular = fp(async (fastify, _options) => {
    fastify.decorateRequest("user", null);
    fastify.register(async (protectedFastify) => {
        protectedFastify.addHook("preHandler", async (request, _reply) => {
            // 1: Extract AT from request body
            const { at } = request.body;
            // 2: Validate AT format
            if (!at.startsWith("v4.public."))
                throw new Error("ERR_AT_INVALID_FORMAT");
            // 3: Verify AT
            const data = await atVerifier(at);
            // 4: Attach user ID to request object
            request.user = { id: data };
        });
        protectedFastify.post("/dashboard", { schema: atSchema }, userDashboard(protectedFastify));
        protectedFastify.post("/edit", { schema: atSchema }, userEdit(protectedFastify));
        protectedFastify.post("/delete", { schema: atSchema }, userDelete(protectedFastify));
        protectedFastify.post("/update", { schema: { body: UserUpdateSchema } }, userUpdate(protectedFastify));
        protectedFastify.post("/signout-from-all", { schema: atSchema }, userSignOutFromAll(protectedFastify));
        protectedFastify.post("/signout-from-one", { schema: { body: UserSignOutFromOneSchema } }, userSignOutFromOne(protectedFastify));
        protectedFastify.post("/e", { schema: atSchema }, playWithErrors(protectedFastify));
    }, { prefix: "/protected" });
});
