import { requireUser } from "../../functions/helper/requireUser.js";
import { requireDid } from "../../functions/helper/requireDid.js";
import { runRedisCommand } from "../../functions/helper/runRedisCommand.js";
export const userSignOutFromOne = (fastify) => {
    return async (request, reply) => {
        // 1: Extract id from request body
        const id = requireUser(request);
        // 2: Extract did from request body.
        const did = requireDid(request);
        // 3: Delete user from Redis
        const { redis } = fastify;
        await runRedisCommand(fastify, async () => {
            redis.getdel(`deviceID:${did}`);
            redis.zrem(`user:${id}:devices`, did);
        }, id);
        // 4: Send reply
        reply.code(200).send({ success: true });
    };
};
