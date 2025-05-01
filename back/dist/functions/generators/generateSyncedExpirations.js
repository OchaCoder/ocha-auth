import { config } from "../../config.js";
import { convertLifetimeToUnixTimestamp } from "./convertLifetimeToUnixTimestamp.js";
export const generateSyncedExpirations = () => {
    // Generates absolute expiration timestamps for:
    // 1: Redis (EXAT) — Unix timestamp (seconds)
    // 2: Cookie `expires` — JavaScript Date (milliseconds)
    // 3: Paseto `exp` (inside payload) — Unix timestamp (seconds)
    // Ensures all three stay perfectly in sync.
    const rtExpInSec = convertLifetimeToUnixTimestamp(config.lifetime.rt);
    const rtExpInMs = rtExpInSec * 1000;
    const rtExpTimestamp = new Date(rtExpInMs); // JS Date needs milliseconds!
    const atExpInSec = convertLifetimeToUnixTimestamp(config.lifetime.at);
    const atExpInMs = atExpInSec * 1000;
    const atExpTimestamp = new Date(atExpInMs); // JS Date needs milliseconds!
    const exp = {
        // redis : Unix timestamp (seconds)
        // cookie expires : JavaScript Date (milliseconds)
        // paseto exp (inside payload) : Unix timestamp (seconds)
        rt: { redisExat: rtExpInSec, cookieExpires: rtExpTimestamp, pasetoExp: rtExpInSec },
        at: { redisExat: atExpInSec, cookieExpires: atExpTimestamp, pasetoExp: atExpInSec },
    };
    return exp;
};
