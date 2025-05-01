import { requireUserId } from "../../functions/helpers/require/require-user-id.js";
import { runRedis } from "../../functions/helpers/run-redis/index.js";
import { runPg } from "../../functions/helpers/run-pg/index.js";
import { ErrorSuspiciousActivity } from "../../error-classes/error-suspicious-activity.js";
export const userDelete = (fastify) => {
    return async (request, reply) => {
        // 1. Extract id from request body
        const id = requireUserId(request);
        // 2. Delete the user from the Database
        const resultBool = await runPg.bool.modify(fastify, `DELETE FROM users WHERE id=$1`, [id], id);
        // 3. Sanity check – Structurally valid, logically impossible
        if (!resultBool)
            throw new ErrorSuspiciousActivity("ERR_USER_VANISHED_MID_OPERATION", `Expected user vanished in the midst of a delete operation. Possibly exploratory, tampering, or replay attack`, {
                identity: `${id}`,
            });
        // 4. Delete user from Redis
        await runRedis.fireAndForget(fastify, async () => {
            const allBid = await fastify.redis.zrange(`user:${id}:devices`, 0, -1);
            if (allBid.length > 0) {
                const keys = allBid.map((bid) => `deviceID:${bid}`);
                fastify.redis.del(keys);
                fastify.redis.del(`user:${id}:devices`);
            }
        }, id);
        // 4: Send reply
        reply.code(200).send({
            success: true,
            data: null,
            sideEffects: {
                cookie: { hasData: false, data: null },
                devNotes: ["Protected action - User is deleting their account."],
            },
        });
    };
};
