/**
 * Use this class if
 *  - banning someone for triggering this error feels bad or wrong
 *  - error could easily be made by a normal user
 *  - the frontend is young and still evolving
 *  - zero identity involved (no cookies, tokens, user ID)
 */
export declare class ErrorDefensiveGuardBreache extends Error {
    constructor(message: string);
}
