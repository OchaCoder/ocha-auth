// 3: Middleware Approach:
// This is a simpler approach for smaller projects where middleware logic is directly applied to specific routes.
// Example of usage at server.ts:
// fastify.decorateRequest("user", null)
// fastify.post("/protected/user", { schema: atSchema, preHandler: authUserMiddleware }, userDashboard(fastify))
export const authUserMiddleware = async (request, reply) => {
    const { at } = request.body;
    // 1. Decode at
    // 2. Take out user id and user name
};
