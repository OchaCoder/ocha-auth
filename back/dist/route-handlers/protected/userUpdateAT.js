import { Type } from "@sinclair/typebox";
export const UserDeletePayloadSchema = Type.String();
// Define schema for this route
const requestPayloadSchema = Type.Partial(Type.Object({
    name: Type.String({ minLength: 1 }),
    email: Type.String({ format: "email" }),
    password: Type.String(),
}));
export const userUpdateAT = (fastify) => {
    return async (request, reply) => {
        if (request.user) {
            // 1: Extract id from request body
            const { id } = request.user;
            // 2: Check if id exists
            if (!id)
                throw new Error("ERRID_NOT_FOUND");
            // 3: Validate id type
            if (typeof id !== "number")
                throw new Error("ERR_WRONG_ID_TYPE");
            const {};
            let client;
            try {
                // 4: Create client to connect
                client = await fastify.pg.connect();
                // 5: Search user based on id.
                const query = `SELECT email, created_at, last_modified_at FROM users WHERE id = $1 LIMIT 1;`;
                const data = await client.query(query, [id]);
                // 6: Validate the returned object
                const userObj = data.rows[0] ?? null; // Defaults to null if undefined or null
                if (!userObj)
                    throw new Error("ERR_NO_USER_RETURNED");
                console.log("🌳🌱🌷🌻The final thing we want to send to the frontend:", userObj);
                // 7:Send reply
                reply.code(200).send({
                    email: userObj.email,
                    createdAt: userObj.created_at,
                    lastModifiedAt: userObj.last_modified_at,
                });
            }
            catch (err) {
                throw err; // Always re-throw the original error
            }
            finally {
                if (client)
                    client.release();
            }
        }
    };
};
