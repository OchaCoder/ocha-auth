/**
 * ⚠️ Use this parser on a Paseto-verified `sub` string to perform a final defensive check.
 *
 * The token should have already passed Paseto v4 verification,
 * which guarantees it was signed with our secret key.
 * If the structure is malformed at this point, it’s most likely a bug
 * during token generation — not an external attack.
 */
export declare const parseIdFromV4Sub: (sub: string) => number;
