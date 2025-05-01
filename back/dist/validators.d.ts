import { Static } from "@sinclair/typebox";
export declare const PgDataUserIDNameSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
    name: import("@sinclair/typebox").TString;
}>;
export declare const PgDataUserIDNameValidator: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
    name: import("@sinclair/typebox").TString;
}>>;
export declare const PgDataUserEditSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    email: import("@sinclair/typebox").TString;
}>;
export declare const PgDataUserEditValidator: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    email: import("@sinclair/typebox").TString;
}>>;
export declare const PgDataUserSignInSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
    name: import("@sinclair/typebox").TString;
    email: import("@sinclair/typebox").TString;
    hashed_password: import("@sinclair/typebox").TString;
}>;
export declare const PgDataUserSignInValidator: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
    name: import("@sinclair/typebox").TString;
    email: import("@sinclair/typebox").TString;
    hashed_password: import("@sinclair/typebox").TString;
}>>;
export declare const PgDataUserUpdateSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
    name: import("@sinclair/typebox").TString;
    email: import("@sinclair/typebox").TString;
}>;
export declare const PgDataUserUpdateValidator: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
    name: import("@sinclair/typebox").TString;
    email: import("@sinclair/typebox").TString;
}>>;
export declare const DecryptedV4ObjValidator: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TObject<{
    sub: import("@sinclair/typebox").TString;
    iat: import("@sinclair/typebox").TString;
    exp: import("@sinclair/typebox").TString;
}>>;
export declare const PgDataATVerifiedUserValidator: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    email: import("@sinclair/typebox").TString;
    created_at: import("@sinclair/typebox").TDate;
    last_modified_at: import("@sinclair/typebox").TDate;
}>>;
declare const DecodedATSubSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
}>;
declare const DecodedRTSubSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
}>;
declare const DecryptedPasetoObjSchema: import("@sinclair/typebox").TObject<{
    sub: import("@sinclair/typebox").TString;
    iat: import("@sinclair/typebox").TString;
    exp: import("@sinclair/typebox").TString;
}>;
declare const UserIDSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
}>;
declare const PasetoSubRPTSchema: import("@sinclair/typebox").TObject<{
    email: import("@sinclair/typebox").TString;
    token: import("@sinclair/typebox").TString;
}>;
export type PasetoSubRPT = Static<typeof PasetoSubRPTSchema>;
export declare const ValidatorPasetoSubRPT: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TObject<{
    email: import("@sinclair/typebox").TString;
    token: import("@sinclair/typebox").TString;
}>>;
export declare const ValidatorEmail: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TString>;
export type DecodedATSub = Static<typeof DecodedATSubSchema>;
export type DecodedRTSub = Static<typeof DecodedRTSubSchema>;
export type DecryptedPasetoObj = Static<typeof DecryptedPasetoObjSchema>;
export type UserID = Static<typeof UserIDSchema>;
export declare const ValidatorDecodedATSub: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
}>>;
export declare const ValidatorDecodedRTSub: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
}>>;
export declare const ValidatorDecryptedPasetoObj: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TObject<{
    sub: import("@sinclair/typebox").TString;
    iat: import("@sinclair/typebox").TString;
    exp: import("@sinclair/typebox").TString;
}>>;
export declare const ValidatorUserID: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
}>>;
export declare const ValidatorRedisRpt: import("@sinclair/typebox/compiler").TypeCheck<import("@sinclair/typebox").TObject<{
    isUsed: import("@sinclair/typebox").TBoolean;
}>>;
export {};
