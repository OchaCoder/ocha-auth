import { config } from "../../config.js";
import { convertLifetimeToUnixTimestamp } from "./convertLifetimeToUnixTimestamp.js";
export const generateStaggeredExpiration = () => {
    // Slightly stagger expiration times to mitigate minor time drifts
    // caused by network lag, reducing redundant operations and edge-case errors.
    const rtExpInSec = convertLifetimeToUnixTimestamp(config.lifetime.rt); // Unix timestamp (seconds)
    // Expected expiration time format:
    // - Redis (SET + EXAT): Unix timestamp (seconds)
    // - Cookie max-age: Unix timestamp (seconds)
    // - Paseto exp (inside payload): Unix timestamp (seconds)
    const exp = {
        rt: {
            pasetoExp: rtExpInSec, // Should expire last
            redisExat: rtExpInSec - 15, // Redis entry expires 15s before RT
            cookieExpires: rtExpInSec - 60, // Cookie expires first (60s before RT)
        },
    };
    return exp;
};
