import { config } from "../../config.js";
import { requireRefreshToken } from "../helpers/require/require-refresh-token.js";
import { validatePasetoV4Token } from "../helpers/validators/validate-paseto-v4-token.js";
import { verifyPasetoV4 } from "../helpers/verifiers/verify-paseto-v4.js";
import { parseIdFromV4Sub } from "../helpers/parsers/parse-id-from-v4-sub.js";
import { validateDecryptedV4Obj } from "../helpers/validators/validate-decrypted-v4-obj.js";
import { validateBrowserId } from "../helpers/validators/validate-browser-id.js";
/**
 * Use this resolver to authenticate user using browser ID `bid`.
 * @param fastify
 * @param reply
 * @param browserId
 * @returns userId which is a type of number.
 */
export const resolveUserIdFromBrowserId = async (fastify, reply, browserId) => {
    // 1. Validate the format of browser ID.
    const validatedBrowserId = validateBrowserId(browserId, `bid::${browserId}`);
    // 2. Retrieve the refresh token from Redis using browser ID. ⚠️User authentication - Stage 1⚠️
    const rawRt = await requireRefreshToken(fastify, validatedBrowserId, `bid::${validatedBrowserId}`);
    // 3. Validate the format of paseto v4 token.
    const validatedRt = validatePasetoV4Token(rawRt, `bid::${validatedBrowserId}_rt::${rawRt}`);
    // 4. `v4.verify` + categorise erros and rethrow. ⚠️User authentication - Stage 2⚠️
    const decryptedV4Obj = await verifyPasetoV4(reply, validatedRt, config.pasetoKeys.public.rt, `bid::${validatedBrowserId}_rt::${validatedRt}`, "rt");
    // 5.  Make sure the decrypted object is in `{sub: string; iat: string; exp: string;}` shape.
    const validDecryptedV4Obj = validateDecryptedV4Obj(decryptedV4Obj);
    // 6. Make sure the `sub` is holding a number.
    const userId = parseIdFromV4Sub(validDecryptedV4Obj.sub);
    // 7. Return.
    return userId;
};
