import { ErrorSuspiciousActivity } from "../../error-classes/error-suspicious-activity.js";
export const requireUser = (request) => {
    const { user } = request;
    if (!user)
        throw new Error("ERR_USER_UNAUTHORIZED");
    if (!user.id)
        throw new ErrorSuspiciousActivity("ERR_USER_VANISHED_MID_OPERATION", "User object present but missing valid ID. Possibly exploratory, tampering", { identity: "unknown" });
    return user.id;
};
