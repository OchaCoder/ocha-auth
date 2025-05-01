import { connectedClients } from "../../functions/helpers/sse-broadcaster.js";
import { sseHeaders } from "../../functions/helpers/sse-headers.js";
// 🌐 SSE route: keeps a long-lived connection open to push live health updates.
export const healthEvents = (fastify) => {
    return async (request, reply) => {
        // Set SSE-specific headers to keep the HTTP connection open.
        sseHeaders(request, reply);
        // Create the client object with a 'send()' function.
        // SSE messages must follow this format:
        //   - Each event starts with 'data:'
        //   - Ends with a double newline '\n\n'
        const client = {
            // 'raw.write()' is low-level Node API that lets us use Node stream to write SSE messages.
            send: (data) => {
                const payload = JSON.stringify(data);
                reply.raw.write(`data: ${payload}\n\n`);
            },
        };
        // Register the client to receive broadcasted updates.
        connectedClients.add(client);
        // Send the initial health status immediately after connection.
        // This gives the user instant feedback without waiting for a change.
        const postgres = fastify.postgresAvailable;
        const redis = fastify.redisAvailable;
        client.send({ success: true, data: { stable: postgres && redis, initialCheck: true } });
        // Clean up: remove the client if they disconnect (e.g., close tab).
        // Prevents memory leaks and unnecessary message attempts.
        request.raw.on("close", () => {
            connectedClients.delete(client);
        });
    };
};
