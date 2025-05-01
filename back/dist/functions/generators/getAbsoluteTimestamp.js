import { config } from "../../config.js";
export const convertLifetimeToUnixTimestamp = (time) => {
    // Converts a time string (e.g., "48h", "30m") into an absolute expiration timestamp (seconds).
    // 1: Extracts number directly
    const value = parseInt(time, 10);
    // 2: Validate number
    if (isNaN(value))
        throw new Error(`ERR_INVALID_NUMBER_IN_LIFETIME: '${time}'`);
    // 3: Prepare unit map
    const unitMap = {
        s: 1,
        sec: 1,
        second: 1,
        seconds: 1,
        m: 60,
        min: 60,
        minute: 60,
        minutes: 60,
        h: 3600,
        hour: 3600,
        hours: 3600,
        d: 86400,
        day: 86400,
        days: 86400,
    };
    // 4: Extract unit by removing leading number
    const unit = time.replace(/^\d+\s*/, "").toLowerCase();
    // 5: Validate unit
    if (!(unit in unitMap))
        throw new Error(`ERR_INVALID_UNIT_IN_LIFETIME: '${time}'`);
    // 6: Convert time in seconds
    const timeAsSec = value * unitMap[unit];
    // 7: Get absolute expiration timestamp (UTC) in seconds
    const expTimestamp = Math.floor(Date.now() / 1000) + timeAsSec;
    return expTimestamp;
};
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
