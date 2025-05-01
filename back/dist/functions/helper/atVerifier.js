import { V4 } from "paseto";
import { config } from "../../config.js";
import { DecodedTokenValidator } from "../../validators.js";
export const atVerifier = async (at) => {
    try {
        const decoded = await V4.verify(at, config.pasetoKeys.public.at);
        if (!DecodedTokenValidator.Check(decoded)) {
            throw new Error("ERR_MALFORMED_AT");
        }
        const parsedSub = JSON.parse(decoded.sub);
        if (typeof parsedSub.id !== "number")
            throw new Error("ERR_INVALID_AT_SUB");
        return parsedSub.id;
    }
    catch (err) {
        if (err.code === "ERR_PASETO_CLAIM_INVALID")
            throw new Error("ERR_AT_EXPIRED", { cause: err });
        // Expired AT should not exist in the browser. Highly suspicious.
        throw new Error("ERR_INVALID_AT", { cause: err });
    }
};
