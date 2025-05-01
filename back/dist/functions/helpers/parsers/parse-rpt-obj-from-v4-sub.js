import { ErrorDefensiveGuardBreach } from "../../../error-classes/error-defensive-guard-breach.js";
import { ValidatorEmail } from "../../../validators.js";
import { isObject } from "../../type-narrower/is-object.js";
/**
 * Parses and validates the `sub` field of a Paseto v4 token (used for password reset).
 *
 * This helper assumes the token has already passed `V4.verify()`,
 * ensuring it was signed with your server's private key.
 *
 * It performs a deep defensive check on the structure of `sub` — a JSON string — and returns its typed contents
 * only if they match the expected format:
 *
 *     { rpt: string; id: number; email: string }
 *
 * If the structure is malformed, this likely indicates a bug during token creation,
 * rather than external tampering — and is treated as a defensive guard breach.
 *
 * @throws {ErrorDefensiveGuardBreach}
 */
export const parseRptObjFromV4Sub = (sub) => {
    const parsedSub = JSON.parse(sub);
    if (parsedSub === null)
        throw new ErrorDefensiveGuardBreach("ERR_V4_SUB_IS_NULL", "The `sub` from the decrypted Paseto v4 is null. Likely a bug during token generation.", {
            specialJson: sub,
            debug: parsedSub,
        });
    if (!isObject(parsedSub))
        throw new ErrorDefensiveGuardBreach("ERR_V4_SUB_NOT_AN_OBJECT", "The `sub` from the decrypted Paseto v4 is not an object. Likely a bug during token generation.", {
            specialJson: sub,
            debug: parsedSub,
        });
    if (!("rpt" in parsedSub) || !("id" in parsedSub) || !("email" in parsedSub)) {
        throw new ErrorDefensiveGuardBreach("ERR_V4_SUB_MISSING_PROPERTY", "The `sub` from the decrypted Paseto v4 object should have all `rpt`,`id`, and `email` properties. Likely a bug during token generation.", {
            specialJson: sub,
            debug: parsedSub,
        });
    }
    if (typeof parsedSub.rpt !== "string" || typeof parsedSub.id !== "number" || !ValidatorEmail.Check(parsedSub.email)) {
        throw new ErrorDefensiveGuardBreach("ERR_V4_SUB_INVALID_PROPERTY_VALUE", "The `sub` from the decrypted Paseto v4 object contains correct set of properties, but the value(s) found invalid. Likely a bug during token generation.", { specialJson: sub, debug: parsedSub });
    }
    const validatedRptObj = { rpt: parsedSub.rpt, id: parsedSub.id, email: parsedSub.email };
    return validatedRptObj;
};
