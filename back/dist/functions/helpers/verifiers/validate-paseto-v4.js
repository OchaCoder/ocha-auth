import { V4 } from "paseto";
import { ErrorSuspiciousActivity } from "../../../error-classes/error-suspicious-activity.js";
export const verifyPasetoV4 = async (reply, v4Token, key, userIdentity) => {
    try {
        const decryptedV4Obj = await V4.verify(v4Token, key);
        return decryptedV4Obj;
    }
    catch (err) {
        switch (err.code) {
            // There are 7 known errors that Paseto could throw during runtime.
            // Here, 5 are covered explicitly.
            // Other 2 errors are `TypeError` and `PasetoError` which is the base error others inherit from.
            case "ERR_PASETO_INVALID":
            case "ERR_PASETO_NOT_SUPPORTED":
            case "ERR_PASETO_DECRYPTION_FAILED":
            case "ERR_PASETO_VERIFICATION_FAILED":
                throw new ErrorSuspiciousActivity("ERR_INVAID_PASETO", "Paseto from reset password email link was invalid. Possibly exploratory or tampering.", { identity: userIdentity });
            case "ERR_PASETO_CLAIM_INVALID":
                return reply.status(500).send({ success: false, code: "ERR_PASETO_V4_TOKEN_EXPIRED" });
            default:
                // Invalid, forged, malformed token should be already caught by above cases.
                // This default case is here to make sure any edge case is caught.
                throw new ErrorSuspiciousActivity("ERR_UNKNOWN_PASETO_ERROR", "Unexpected Paseto error. Possibly malformed or forged.", { identity: userIdentity });
        }
    }
};
