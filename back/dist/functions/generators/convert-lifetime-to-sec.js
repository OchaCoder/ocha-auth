import { ErrorDefensiveGuardBreach } from "../../error-classes/error-defensive-guard-breach.js";
export const convertLifetimeToSec = (time) => {
    // Converts a time string (e.g., "48h", "30m") into an absolute expiration timestamp (seconds).
    // 1: Extracts number directly
    const value = parseInt(time, 10);
    // 2: Validate number
    if (isNaN(value))
        throw new ErrorDefensiveGuardBreach(`ERR_INVALID_NUMBER_IN_LIFETIME: '${time}'`);
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
        throw new ErrorDefensiveGuardBreach(`ERR_INVALID_NUMBER_IN_LIFETIME: '${time}'`);
    // 6: Convert time in seconds
    const lifetimeInSec = value * unitMap[unit];
    return lifetimeInSec;
};
