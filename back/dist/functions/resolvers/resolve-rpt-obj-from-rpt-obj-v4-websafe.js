import { config } from "../../config.js";
import { validateDecryptedV4Obj } from "../helpers/validators/validate-decrypted-v4-obj.js";
import { verifyPasetoV4 } from "../helpers/verifiers/verify-paseto-v4.js";
import { webSafeAtoB } from "../helpers/web-safe-64.js";
import { validatePasetoV4Token } from "../helpers/validators/validate-paseto-v4-token.js";
import { parseRptObjFromV4Sub } from "../helpers/parsers/parse-rpt-obj-from-v4-sub.js";
export const resolveRptObjFromRptObjV4Websafe = async (reply, rptObjV4Websafe, userIdentifier) => {
    // 1. 'webSafeBtoA' was used at the encoding stage. `webSafeAtoB(rpt)` is the pairing helper for decoding.
    const expectRptV4 = webSafeAtoB(rptObjV4Websafe);
    // 2. Validate paseto v4 token.
    const validatedRptV4 = validatePasetoV4Token(expectRptV4, userIdentifier);
    // 3. `v4.verify` wrapper that categorizes and rethrow errors.
    const decryptedV4Obj = await verifyPasetoV4(reply, validatedRptV4, config.pasetoKeys.public.rpt, userIdentifier, "rpt");
    // 4. Make sure the decrypted object is in `{sub: string; iat: string; exp: string;}` shape.
    const decryptedV4ObjWithSub = validateDecryptedV4Obj(decryptedV4Obj);
    // 5. Make sure the parsed `sub` is in { rpt : string } shape, and return `rpt`.
    const validatedRpt = parseRptObjFromV4Sub(decryptedV4ObjWithSub.sub);
    // 6. Return
    return validatedRpt;
};
