export const validateRT = (rt) => {
    // 1: Check for presence
    if (!rt)
        throw new Error("ERR_RT_NOT_FOUND_IN_REDIS"); // AppError("ERR_RT_NOT_FOUND_IN_REDIS", { reason: "Session expired?" })
    // 2: Validate type
    else if (!(typeof rt === "string"))
        throw new Error("ERR_INVALID_RT_TYPE");
    // 3: Validate Paseto Format (v4)
    else if (!rt.startsWith("v4.public."))
        throw new Error("ERR_MALFORMED_RT_DETECTED");
    return rt;
};
