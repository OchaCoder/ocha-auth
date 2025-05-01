import { ErrorDefensiveGuardBreach } from "../../../error-classes/error-defensive-guard-breach.js";
import { isNumber } from "../../type-narrower/is-number.js";
import { isObject } from "../../type-narrower/is-object.js";
/**
 * ⚠️ Use this parser on a Paseto-verified `sub` string to perform a final defensive check.
 *
 * The token should have already passed Paseto v4 verification,
 * which guarantees it was signed with our secret key.
 * If the structure is malformed at this point, it’s most likely a bug
 * during token generation — not an external attack.
 */
export const parseIdFromV4Sub = (sub) => {
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
    if (!("id" in parsedSub))
        throw new ErrorDefensiveGuardBreach("ERR_V4_SUB_MISSING_ID_PROPERTY", "The `sub` from the decrypted Paseto v4 object is missing the `id` property. Likely a bug during token generation.", {
            specialJson: sub,
            debug: parsedSub,
        });
    if (!isNumber(parsedSub.id))
        throw new ErrorDefensiveGuardBreach("ERR_V4_SUB_INVALID_PROPERTY", "The `sub` from the decrypted Paseto v4 object contains `id`, but the value is not a number. Likely a bug during token generation.", { specialJson: sub, debug: parsedSub });
    return parsedSub.id;
};
