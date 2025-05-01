import { ValidatorDecodedRT, ValidatorDecodedRTSub } from "../../validators.js";
// used in sign in
export const validateDecodedRT = (decodedRt) => {
    // 1: Validate top-level refresh token structure
    if (!ValidatorDecodedRT.Check(decodedRt))
        throw new Error("ERR_INVALID_RT_STRUCTURE");
    // 2: Attempt to parse 'sub'
    let parsedSub;
    try {
        parsedSub = JSON.parse(decodedRt.sub);
    }
    catch {
        throw new Error("ERR_MALFORMED_RT_SUB");
    }
    // 3: Validate parsed 'sub'
    if (!ValidatorDecodedRTSub.Check(parsedSub))
        throw new Error("ERR_INVALID_RT_SUB_STRUCTURE");
    // 4: Return easy to use object
    return { ...decodedRt, parsedSub };
};
