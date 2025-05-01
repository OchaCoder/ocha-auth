export const requireBid = (request) => {
    const { bid } = request.body;
    if (!bid)
        throw new Error("ERR_BID_NOT_FOUND");
    return bid;
};
