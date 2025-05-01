// Simple pub/sub system for SSE (Server-Sent Events).
// Each browser that calls 'new EventSource(path)' will be added to this Set
// via 'connectedClients.add(client)', allowing us to push real-time updates to them.
export const connectedClients = new Set();
// Broadcast the current health status to all connected clients.
export const broadcastCurrentHealth = (fastify) => {
    const postgres = fastify.postgresAvailable;
    const redis = fastify.redisAvailable;
    const frontendPayload = { success: true, data: { stable: postgres && redis, initialCheck: false } };
    // Loop over all connected clients and push the latest status.
    for (const client of connectedClients) {
        // 'send()' formats and writes SSE data using Node's raw HTTP stream.
        client.send(frontendPayload);
    }
};
// Tracks the last known state of Redis/Postgres health.
// This helps us prevent sending duplicate SSE updates when nothing has changed.
//
// Initial values are set to 'true' by default, but this doesn't affect correctness:
// - If a service is down at startup, the first health check will push the correct state.
// - If both are healthy, this state already reflects reality, and no push is sent.
const lastKnownHealth = { postgres: true, redis: true };
// Called after every Redis or Postgres health check.
// If the health state has changed since the last push, we notify clients via SSE.
export const sseHealth = (fastify) => {
    const latestHealth = {
        postgres: fastify.postgresAvailable,
        redis: fastify.redisAvailable,
    };
    const needsPush = latestHealth.postgres !== lastKnownHealth.postgres || latestHealth.redis !== lastKnownHealth.redis;
    if (needsPush) {
        broadcastCurrentHealth(fastify);
        lastKnownHealth.postgres = latestHealth.postgres;
        lastKnownHealth.redis = latestHealth.redis;
    }
};
