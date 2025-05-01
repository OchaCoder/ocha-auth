export const requireUser = (request) => {
    const { user } = request;
    if (!user)
        throw new Error("Unauthorized");
    if (!user.id)
        throw new Error("ERR_ID_NOT_FOUND");
    return user.id;
};
