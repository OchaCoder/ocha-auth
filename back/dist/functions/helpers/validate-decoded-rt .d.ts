import { DecodedRT, DecodedRTSub } from "../../validators.js";
export declare const validateDecodedRT: (decodedRt: unknown) => DecodedRT & {
    parsedSub: DecodedRTSub;
};
