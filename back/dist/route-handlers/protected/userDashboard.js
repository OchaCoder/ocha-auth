import { PgDataATVerifiedUserValidator as Validator } from "../../validators.js";
import { runPgQuery } from "../../functions/helper/runPgQuery.js";
import { requireUser } from "../../functions/helper/requireUser.js";
export const userDashboard = (fastify) => {
    return async (request, reply) => {
        // 1. Extract id from request body
        const id = requireUser(request);
        // 2. Create client to connect
        // 3. Search user based on id.
        // 4. Validate the returned object
        const query = `SELECT name, email, created_at, last_modified_at FROM users WHERE id = $1 LIMIT 1;`;
        const data = await runPgQuery(fastify, query, [id], id, Validator);
        if (!data)
            throw new Error("ERR_NO_USER_RETURNED");
        const validatedData = data;
        // 5. Send reply
        reply.code(200).send({
            success: true,
            data: {
                name: validatedData.name,
                email: validatedData.email,
                createdAt: validatedData.created_at,
                lastModifiedAt: validatedData.last_modified_at,
            },
        });
    };
};
