import { FastifyReply } from "fastify"
import { verifyPasetoV4 } from "../helpers/verifiers/verify-paseto-v4.js"
import { config } from "../../config.js"
import { validateDecryptedV4Obj } from "../helpers/validators/validate-decrypted-v4-obj.js"
import { parseIdFromV4Sub } from "../helpers/parsers/parse-id-from-v4-sub.js"
import { validatePasetoV4Token } from "../helpers/validators/validate-paseto-v4-token.js"

export const resolveUserIdFromAccessToken = async (reply: FastifyReply, accessToken: unknown, userIdentifier: string): Promise<number> => {
  // 1. Make sure that the access token looks like a valid Paseto v4 public token.
  const validatedAcessToken = validatePasetoV4Token(accessToken, userIdentifier)

  // 2. `v4.verify` + categorise erros and rethrow.
  const decryptedV4Obj = await verifyPasetoV4(reply, validatedAcessToken, config.pasetoKeys.public.at, userIdentifier, "at")

  // 3. Make sure the decrypted object is in `{sub: string; iat: string; exp: string;}` shape.
  const validDecryptedV4Obj = validateDecryptedV4Obj(decryptedV4Obj)

  // 4. Make sure the `sub` is holding a number.
  const userId = parseIdFromV4Sub(validDecryptedV4Obj.sub)

  // 5. Return.
  return userId
}
