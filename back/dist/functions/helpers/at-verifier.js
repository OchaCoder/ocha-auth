import { V4 } from "paseto";
import { config } from "../../config.js";
import { DecodedTokenValidator } from "../../validators.js";
export const atVerifier = async (at) => {
    try {
        const decoded = await V4.verify(at, config.pasetoKeys.public.at);
        // A bug or someone crafting a fake AT that can decode but not validate. => logout + redirect
        if (!DecodedTokenValidator.Check(decoded))
            throw new Error("ERR_MALFORMED_AT");
        const parsedSub = JSON.parse(decoded.sub);
        // A bug or someone is forging tokens. => logout + redirect
        if (typeof parsedSub.id !== "number")
            throw new Error("ERR_INVALID_AT_SUB");
        return parsedSub.id;
    }
    catch (err) {
        // Expected behavior for inactive users.
        if (err.code === "ERR_PASETO_CLAIM_INVALID")
            throw new Error("ERR_AT_EXPIRED");
        // tampering, backend bug, or transmission corruption. => logout + redirect.
        throw new Error("ERR_INVALID_AT", { cause: err });
    }
};
