import { config } from "../../config.js";
import { parseRptFromV4Sub } from "../helpers/parsers/parse-rpt-from-v4-sub.js";
import { validateDecryptedV4Obj } from "../helpers/validators/validate-decrypted-v4-obj.js";
import { verifyPasetoV4 } from "../helpers/verifiers/verify-paseto-v4.js";
import { webSafeAtoB } from "../helpers/web-safe-64.js";
import { validatePasetoV4Token } from "../helpers/validators/validate-paseto-v4-token.js";
export const resolveUserObjectFromRpt = async (reply, rptV4Websafe, userIdentifier) => {
    // 1. 'webSafeBtoA' was used at the encoding stage.`webSafeAtoB(rpt)` is the pairing helper for decoding.
    const rptV4 = webSafeAtoB(rptV4Websafe);
    // 2. Validate paseto v4 token.
    const validatedRptV4 = validatePasetoV4Token(rptV4, userIdentifier);
    // 3. `v4.verify` + categorise erros and rethrow.
    const decryptedV4Obj = await verifyPasetoV4(reply, validatedRptV4, config.pasetoKeys.public.rpt, userIdentifier, "rpt");
    // 4. Make sure the decrypted object is in `{sub: string; iat: string; exp: string;}` shape.
    const validatedDecryptedV4Obj = validateDecryptedV4Obj(decryptedV4Obj);
    // 5. Make sure the parsed `sub` in in `{id: string; email: string;}` shape.
    const validatedUserObj = parseRptFromV4Sub(validatedDecryptedV4Obj.sub);
    // 6. Return
    return validatedUserObj;
};
