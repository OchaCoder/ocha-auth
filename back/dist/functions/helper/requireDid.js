export const requireDid = (request) => {
    const { did } = request.body;
    if (!did)
        throw new Error("ERR_DID_NOT_FOUND");
    return did;
};
