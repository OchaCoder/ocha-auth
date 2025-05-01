import { requireUser } from "../../functions/helper/requireUser.js";
import { runPgQuery } from "../../functions/helper/runPgQuery.js";
import { PgDataUserUpdateValidator as Validator } from "../../validators.js";
export const userUpdate = (fastify) => {
    return async (request, reply) => {
        // 1: Extract id from request body
        const id = requireUser(request);
        // 2: Extract oldValues, newValues from request body
        const { oldValues, newValues } = request.body; // guaranteed to match UserUpdateSchema
        // 4: Check which fields are actually present
        const receivedFields = Object.keys(newValues); // Do not destructure! Use it directly
        if (receivedFields.length === 0)
            reply.status(400).send({ error: "ERR_NO_DATA_PROVIDED" });
        // 5: Dynamically construct SET clause and values
        const setClauses = receivedFields.map((field, index) => `"${field}" = $${index + 1}`).join(", ") + `, last_modified_at = NOW()`;
        const values = [...receivedFields.map((field) => newValues[field]), `${id}`];
        // 6: Final Query string
        const query = `UPDATE users SET ${setClauses} WHERE id = $${receivedFields.length + 1} RETURNING id, name, email;`;
        // 7: Update postgres table, and validate the returning data
        const data = await runPgQuery(fastify, query, values, id, Validator);
        if (!data)
            throw new Error("ERR_UPDATE_FAILDED");
        const validatedData = data;
        // 8: Send reply
        reply.code(200).send({
            success: true,
            data: {
                userData: {
                    name: { updated: true, oldValue: oldValues.name, newValue: validatedData.name },
                    email: { updated: true, oldValue: oldValues.email, newValue: validatedData.email },
                },
            },
        });
    };
};
