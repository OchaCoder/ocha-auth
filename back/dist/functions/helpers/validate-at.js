import { config } from "../../config.js";
import { verifyPasetoV4 } from "./verifiers/verify-paseto-v4.js";
import { validateDecryptedV4Obj } from "./validators/validate-decrypted-v4-obj.js";
import { parseIdFromV4Sub } from "./parsers/parse-id-from-v4-sub.js";
export const atVerifier = async (reply, at) => {
    const decodedAt = await verifyPasetoV4(reply, at, config.pasetoKeys.public.at, "idenfier");
    const validDecryptedV4Obj = validateDecryptedV4Obj(decodedAt);
    const id = parseIdFromV4Sub(validDecryptedV4Obj.sub);
    return id;
};
