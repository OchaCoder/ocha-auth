import { ValidatorUserID as Validator } from "../../validators.js";
import { nanoid } from "nanoid";
import { config } from "../../config.js";
import { Resend } from "resend";
import { webSafeBtoA } from "../../functions/helpers/web-safe-64.js";
import { V4 } from "paseto";
import { runRedis } from "../../functions/helpers/run-redis/index.js";
import { runPg } from "../../functions/helpers/run-pg/index.js";
import { Type } from "@sinclair/typebox";
// Request body @userResetPasswordPreEmail
export const UserResetPasswordSchemaPreEmailSchema = Type.Object({
    payload: Type.Object({
        hasData: Type.Literal(true),
        data: Type.Object({
            email: Type.String(),
        }),
    }),
});
export const userResetPasswordPreEmail = (fastify) => {
    return async (request, reply) => {
        // 1. Extract email from request body
        const { email } = request.body.payload.data;
        // 2. Use email to get userID from Postgres.
        const query = `SELECT id FROM users WHERE email = $1 LIMIT 1;`;
        const validatedData = await runPg.query.obj(fastify, query, [email], email, Validator);
        // 3. User is not in the system if null.
        // 👉Future Idea: Insert monitoring point (Prometheus/Grafana) for failures.
        if (validatedData === null)
            return reply.status(400).send({ success: false, code: "ERR_PASS_RESET_REQUEST_W_UNREGISTERED_EMAIL" });
        // 4. Destructure userID
        const userId = validatedData.id;
        // 5. Create `rpt` and `rptHashed`
        const rpt = nanoid();
        // 6. Create `rptObjectV4` by encrypting `sub` object including `rpt`, `userId`, amd `email`, using Paseto V4.
        const rptObjV4 = await V4.sign({ sub: JSON.stringify({ rpt, id: userId, email }) }, config.pasetoKeys.secret.rpt, { expiresIn: config.ttl.rpt }); // ttl is 180 seconds.
        // 7. Store `{ isUsed: false }` flag object in Redis using `rpt` as its key, with a shorter TTL than 180 seconds.
        runRedis.fireAndForget(fastify, async () => await fastify.redis.set(`reset:${rpt}`, JSON.stringify({ isUsed: false }), "EX", 170), `id::${userId}-email::${email}`); // ttl is 170 seconds.
        // When resetting password via email, the fundamental security and validity of user authentication derives from
        // the credibility of the relationship between user and their email account.
        // Therefore, if the user's email account was already compromised, protecting such user's security
        // becomes out of the scope of this process.
        // However, a system is still accountable for keeping user information secure, even in cases such as token leak.
        // Using a very short TTL (180 seconds) for `V4.sign` is a defensive design choice to mitigate such scenario.
        // Additionally, Redis is used to provide one-time-use protection to prevent any potential misuse from race conditions or token replay.
        // This hybrid design balances stateless validation performance with server-side invalidation when necessary.
        // 8. Generate password reset URL.
        const rptPrefix = `puf`; // For adding a low cost format check in the frontend.
        const rptObjV4Websafe = webSafeBtoA(rptObjV4); // Disguises V4 format cosmetically.
        const rptUrl = `${config.FRONTEND_URL}/reset/password-setup/${rptPrefix}${rptObjV4Websafe}`;
        // 9. Send email
        const resend = new Resend(config.resend);
        try {
            await resend.emails.send({
                from: "OchaCoder 🍵 <no-reply@ochacoder.com>",
                to: email,
                subject: "Your password reset link is ready from OchaCoder🍵✨",
                html: `
        <p>Hello!🍵 As you have requested, here is your reset link:</p>
        <br>
        <div><a href="${rptUrl}">${rptUrl}</a></div>
        <br>
        <p>If this is not familiar, please reach out to our support at support@ochacoder.com</p>
        `,
                text: `Hello! Here's your reset link: ${rptUrl}`,
                headers: {
                    "List-Unsubscribe": "<mailto:no-reply@ochacoder.com>",
                },
            });
        }
        catch (err) {
            throw new Error("ERR_RESEND_FAILED_TO_SEND_EMAIL");
        }
        // 12. Send reply
        reply.code(200).send({
            success: true,
            data: null,
            sideEffects: {
                cookie: { hasData: false, data: null },
                devNotes: ["General action - User is requesting password reset email."],
            },
        });
    };
};
