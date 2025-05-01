export const requireAccessToken = (request) => {
    const { at } = request.body;
    if (!at)
        throw new Error("ERR_AT_NOT_FOUND_IN_REQUEST_BODY");
    return at;
};
