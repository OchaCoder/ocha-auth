import { requireUser } from "../../functions/helper/requireUser.js";
import { runPgModify } from "../../functions/helper/runPgModify.js";
import { runRedisCommand } from "../../functions/helper/runRedisCommand.js";
export const userDelete = (fastify) => {
    return async (request, reply) => {
        // 1: Extract id from request body
        const id = requireUser(request);
        // 2: Delete the user from the Database
        const result = await runPgModify(fastify, `DELETE FROM users WHERE id=$1`, [id], id);
        if (!result)
            throw new Error("ERR_NOTHING_WAS_DELETED"); // The data is already gone!
        // 3: Delete user from Redis
        const { redis } = fastify;
        await runRedisCommand(fastify, async () => {
            const allDid = await redis.zrange(`user:${id}:devices`, 0, -1);
            if (allDid.length > 0) {
                const keys = allDid.map((did) => `deviceID:${did}`);
                redis.del(keys);
                redis.del(`user:${id}:devices`);
            }
        }, id);
        // 4: Send reply
        reply.code(200).send({ success: true });
    };
};
