// For wrapping node-pg errors
class PgError extends Error {
    details;
    query;
    originalError;
    constructor({ message, query, details, originalError }) {
        super(message);
        this.name = "PgError";
        this.details = "create some detailed description using default error from node-pg!";
        this.query = query;
        this.originalError = originalError;
        Error.captureStackTrace(this, this.constructor); // Remove constructor clutter
    }
}
async function withPgTransaction(fastify, callback) {
    let client;
    try {
        client = await fastify.pg.connect();
        await client.query("BEGIN");
        const result = await callback(client);
        await client.query("COMMIT");
        return result;
    }
    catch (err) {
        if (client)
            await client.query("ROLLBACK");
        throw new PgError({
            message: "PostgreSQL transaction failed",
            details: err.detail || err.message,
            query: err.query || "Unknown query",
            originalError: err,
        });
    }
    finally {
        if (client)
            client.release();
    }
}
const runPGTransaction = async (fastify, callback) => {
    let client;
    try {
        client = await fastify.pg.connect();
        await client.query("BEGIN");
        const result = await callback(client);
        await client.query("COMMIT");
        return result;
    }
    catch (err) {
        if (client)
            await client.query("ROLLBACK");
        throw new PgError({
            message: "PostgreSQL transaction failed",
            details: err.detail || err.message,
            query: err.query || "Unknown query",
            originalError: err,
        });
    }
    finally {
        if (client)
            client.release();
    }
};
export {};
