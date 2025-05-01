import { config } from "../../config.js";
import { validateDecryptedV4Obj } from "../helpers/validators/validate-decrypted-v4-obj.js";
import { verifyPasetoV4 } from "../helpers/verifiers/verify-paseto-v4.js";
import { validatePasetoV4Token } from "../helpers/validators/validate-paseto-v4-token.js";
import { parseUserObjFromV4Sub } from "../helpers/parsers/parse-user-obj-from-v4-sub.js";
export const resolveUserObjectFromV4 = async (reply, expectUserObjV4, userIdentifier) => {
    // 1. Validate paseto v4 token.
    const validatedRptV4 = validatePasetoV4Token(expectUserObjV4, userIdentifier);
    // 2. `v4.verify` + categorise erros and rethrow.
    const decryptedV4Obj = await verifyPasetoV4(reply, validatedRptV4, config.pasetoKeys.public.rpt, userIdentifier, "rptUserObj");
    // 3. Make sure the decrypted object is in `{sub: string; iat: string; exp: string;}` shape.
    const decryptedV4ObjWithSubj = validateDecryptedV4Obj(decryptedV4Obj);
    // 4. Make sure the parsed `sub` in in `{id: string; email: string;}` shape.
    const validatedUserObj = parseUserObjFromV4Sub(decryptedV4ObjWithSubj.sub);
    // 5. Return
    return validatedUserObj;
};
