export declare const DecryptedV4ObjSchema: import("@sinclair/typebox").TObject<{
    sub: import("@sinclair/typebox").TString;
    iat: import("@sinclair/typebox").TString;
    exp: import("@sinclair/typebox").TString;
}>;
/**
 * Validates the shape of a decrypted Paseto v4 object.
 *
 * The argument should be the result of a successful `V4.verify()` call.
 *
 * If this check fails, it means the token was cryptographically valid
 * but structurally unexpected — indicating a likely bug in the Paseto generation logic.
 */
export declare const validateDecryptedV4Obj: (decryptedV4Obj: unknown) => {
    sub: string;
    iat: string;
    exp: string;
};
