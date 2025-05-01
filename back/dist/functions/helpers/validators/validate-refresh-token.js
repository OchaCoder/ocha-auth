export const validateRefreshToken = (refreshToken) => {
    // Validate the format of refresh token
    if (!refreshToken.startsWith("v4.public."))
        throw new Error("ERR_RT_FORMAT_NOT_V4");
    return refreshToken;
};
