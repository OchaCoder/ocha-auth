/**
 * Use this class if
 *  - banning someone for triggering this error feels bad or wrong
 *  - error could easily be made by a normal user
 *  - the frontend is young and still evolving
 *  - zero identity involved (no cookies, tokens, user ID)
 */
export class ErrorDefensiveGuardBreache extends Error {
    constructor(message) {
        super(message);
        this.name = "Error Defensive Guard Breached";
        // Excludes the constructor function and maintains clean stack trace
        // for where error was thrown (only in V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorDefensiveGuardBreache);
        }
    }
}
