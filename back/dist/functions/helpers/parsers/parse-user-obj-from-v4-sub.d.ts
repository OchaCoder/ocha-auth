/**
 * Parses and validates the `sub` field of a Paseto v4 token (used for password reset).
 *
 * This helper assumes the token has already passed `V4.verify()`,
 * ensuring it was signed with your server's private key.
 *
 * It performs a deep defensive check on the structure of `sub` — a JSON string — and returns its typed contents
 * only if they match the expected format:
 *
 *     { id: number, email: string (valid format) }
 *
 * If the structure is malformed, this likely indicates a bug during token creation,
 * rather than external tampering — and is treated as a defensive guard breach.
 *
 * @throws {ErrorDefensiveGuardBreach}
 */
export declare const parseUserObjFromV4Sub: (sub: string) => {
    id: number;
    email: string;
};
