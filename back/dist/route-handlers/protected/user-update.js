import { requireUserId } from "../../functions/helpers/require/require-user-id.js";
import { PgDataUserUpdateValidator as Validator } from "../../validators.js";
import { ErrorDefensiveGuardBreach } from "../../error-classes/error-defensive-guard-breach.js";
import { runPg } from "../../functions/helpers/run-pg/index.js";
import { ErrorSuspiciousActivity } from "../../error-classes/error-suspicious-activity.js";
import { Type } from "@sinclair/typebox";
// Request body @userUpdate
export const RequestBodyUserUpdateSchema = Type.Object({
    at: Type.String(),
    payload: Type.Object({
        hasData: Type.Literal(true),
        data: Type.Object({
            oldValues: Type.Object({
                name: Type.String({ minLength: 1 }),
                email: Type.String({ format: "email" }),
            }),
            newValues: Type.Object({
                name: Type.Optional(Type.String({ minLength: 1 })),
                email: Type.Optional(Type.String({ format: "email" })),
            }),
        }),
    }),
});
export const userUpdate = (fastify) => {
    return async (request, reply) => {
        // 1. Extract id from request body
        const id = requireUserId(request);
        // 2. Extract oldValues, newValues from request body
        const { oldValues, newValues } = request.body.payload.data; // guaranteed to exist
        // 4. Check which fields are actually present
        const receivedFields = Object.keys(newValues); // Do not destructure! Use it directly
        // Defensive guard — should never happen with Qwik’s frontend.
        // But added here in case of future changes or bypass attempts.
        if (receivedFields.length === 0)
            throw new ErrorDefensiveGuardBreach("ERR_NO_UPDATE_FIELD_PROVIDED", "Update attempt received with no fields to update.");
        // 5. Dynamically construct SET clause and values
        const setClauses = receivedFields.map((field, index) => `"${field}" = $${index + 1}`).join(", ") + `, last_modified_at = NOW()`;
        const values = [...receivedFields.map((field) => newValues[field]), `${id}`];
        // 6. Final Query string
        const query = `UPDATE users SET ${setClauses} WHERE id = $${receivedFields.length + 1} RETURNING id, name, email;`;
        // 7. Update postgres table, and validate the returning data
        const validatedData = await runPg.query.obj(fastify, query, values, id, Validator);
        // 8. Sanity check – Structurally valid, logically impossible
        if (validatedData === null)
            throw new ErrorSuspiciousActivity("ERR_USER_VANISHED_MID_OPERATION", `Expected user vanished in the midst of an update operation. Possibly exploratory, tampering, or replay attack`, {
                identity: `${id}`,
            });
        // 9. Send reply
        reply.code(200).send({
            success: true,
            data: {
                userData: {
                    name: { updated: true, oldValue: oldValues.name, newValue: validatedData.name },
                    email: { updated: true, oldValue: oldValues.email, newValue: validatedData.email },
                },
            },
            sideEffects: {
                cookie: { hasData: false, data: null },
                devNotes: ["Protected action - User is updating account information."],
            },
        });
    };
};
