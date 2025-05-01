import argon2 from "argon2";
import { V4 } from "paseto";
import { nanoid } from "nanoid";
import crypto from "crypto";
import { config } from "./../config.js";
import { convertLifetimeToSec } from "../functions/generators/convert-lifetime-to-sec.js";
import { webSafeBtoA } from "../functions/helpers/web-safe-64.js";
export const playground = (fastify) => {
    return async (request, reply) => {
        const key = await V4.generateKey("public", { format: "paserk" });
        const keyObj = await V4.generateKey("public", { format: "keyobject" });
        const nanoID = nanoid(36);
        const cryptoToken = crypto.randomBytes(32).toString("hex"); // 64-character hex string (256-bit randomness)
        const { redis } = fastify;
        redis.set(`TESTING001`, "overwirte is possible!");
        redis.del("RT:1gV1VvFSjDMzErnRzVxaz");
        console.log("Hey!");
        const sec = convertLifetimeToSec(config.ttl.rt);
        console.log("what sec???", sec);
        const userID = 36;
        const argonHash = await argon2.hash(`userID`, {
            ...config.argon2Config,
            raw: true, // returns Uint8Array instead of base64 string
        });
        const pasetoToken = await V4.sign({ sub: JSON.stringify({ email: `bygrd@gmail.com`, token: `abcdefg12345` }) }, config.pasetoKeys.secret.rpt, { expiresIn: config.ttl.rpt });
        const paseto64 = webSafeBtoA(pasetoToken);
        const decryptedPasetoObj = await V4.verify(pasetoToken, config.pasetoKeys.public.rpt);
        const rptClient = webSafeBtoA(`byged.mail@gmail.com_____${nanoid()}`);
        reply.send({
            message: "you are accessing /pl and this is our Playground!!!🥁🌻🌱✨",
            key: key,
            keyObj: keyObj,
            nanoID: nanoID,
            crypto: cryptoToken,
            argon2Hash: argonHash,
            rptClient: rptClient,
            pasetoToken,
            paseto64,
            decryptedPasetoObj,
        });
    };
};
