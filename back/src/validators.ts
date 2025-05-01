import { Type, Static, FormatRegistry } from "@sinclair/typebox"
import { TypeCompiler } from "@sinclair/typebox/compiler"
import { DecryptedV4ObjSchema } from "./functions/helpers/validators/validate-decrypted-v4-obj.js"
import { RedisRptSchema } from "./route-handlers/auth/user-reset-password-verify-token.js"

export const PgDataUserIDNameSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
})

export const PgDataUserIDNameValidator = TypeCompiler.Compile(PgDataUserIDNameSchema)

// PG return data @userEdit
export const PgDataUserEditSchema = Type.Object({
  name: Type.String(),
  email: Type.String(),
})
export const PgDataUserEditValidator = TypeCompiler.Compile(PgDataUserEditSchema)

export const PgDataUserSignInSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  email: Type.String(),
  hashed_password: Type.String(),
})
export const PgDataUserSignInValidator = TypeCompiler.Compile(PgDataUserSignInSchema)

// PG return data @userUpdate
export const PgDataUserUpdateSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  email: Type.String(),
})
export const PgDataUserUpdateValidator = TypeCompiler.Compile(PgDataUserUpdateSchema)

// For validating paseto V4 decrypted object.

export const DecryptedV4ObjValidator = TypeCompiler.Compile(DecryptedV4ObjSchema)

// PG return data @userDashboard
const PgDataATVerifiedUserSchema = Type.Object({
  name: Type.String(),
  email: Type.String(),
  created_at: Type.Date(),
  last_modified_at: Type.Date(),
})
export const PgDataATVerifiedUserValidator = TypeCompiler.Compile(PgDataATVerifiedUserSchema)

const DecodedATSubSchema = Type.Object({
  // Same thing as UserId
  id: Type.Number(),
})

const DecodedRTSubSchema = Type.Object({
  // Same thing as UserId
  id: Type.Number(),
})

const DecryptedPasetoObjSchema = Type.Object({
  sub: Type.String(),
  iat: Type.String(),
  exp: Type.String(),
})

const UserIDSchema = Type.Object({
  id: Type.Number(),
})

// Decrypted Paseto Sub for RPT
const PasetoSubRPTSchema = Type.Object({
  email: Type.String(),
  token: Type.String(),
})
export type PasetoSubRPT = Static<typeof PasetoSubRPTSchema>
export const ValidatorPasetoSubRPT = TypeCompiler.Compile(PasetoSubRPTSchema)

// Register the email format
FormatRegistry.Set("email", (value) => {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
})

// Compile and use
export const ValidatorEmail = TypeCompiler.Compile(Type.String({ format: "email" }))

export type DecodedATSub = Static<typeof DecodedATSubSchema> // Same thing as UserId

export type DecodedRTSub = Static<typeof DecodedRTSubSchema> // Same thing as UserId

export type DecryptedPasetoObj = Static<typeof DecryptedPasetoObjSchema>

export type UserID = Static<typeof UserIDSchema>

// Compile validators
export const ValidatorDecodedATSub = TypeCompiler.Compile(DecodedATSubSchema) // Same thing as UserId

export const ValidatorDecodedRTSub = TypeCompiler.Compile(DecodedRTSubSchema) // Same thing as UserId

export const ValidatorDecryptedPasetoObj = TypeCompiler.Compile(DecryptedPasetoObjSchema)

export const ValidatorUserID = TypeCompiler.Compile(UserIDSchema)

// For validating raw data from Redis @user-reset-password-post-email.ts

export const ValidatorRedisRpt = TypeCompiler.Compile(RedisRptSchema)
