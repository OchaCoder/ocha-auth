import { requireUser } from "../../functions/helper/requireUser.js";
import { runPgQuery } from "../../functions/helper/runPgQuery.js";
import { PgDataUserEditValidator as Validator } from "../../validators.js";
export const userEdit = (fastify) => {
    return async (request, reply) => {
        // 1: Extract id from request body
        const id = requireUser(request);
        // 2: Get user data
        const query = `SELECT name, email FROM users WHERE id = $1;`;
        const data = await runPgQuery(fastify, query, [id], id, Validator);
        if (!data)
            throw new Error("ERR_NO_USER_RETURNED");
        const validatedData = data;
        // 3: Send reply
        reply.code(200).send({ success: true, data: validatedData });
    };
};
