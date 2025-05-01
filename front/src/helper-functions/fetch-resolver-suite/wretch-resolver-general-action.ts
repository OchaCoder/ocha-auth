import type { RequestEvent, RequestEventAction, RequestEventLoader } from "@builder.io/qwik-city"
import type { GeneralActionCode } from "./backend-op-codes"
import wretch from "wretch"
import { configPublic } from "../../config-public"
import { wretchErrorHandler } from "./wretch-error-handler"
import { backendPathResolver } from "./map/backend-path-map"
import { rawReplyValidator } from "./raw-reply-validator"

export const wretchResolverGeneralAction = async <const C extends GeneralActionCode>(
  serverData: {
    code: C
    payload: { hasData: true; data: unknown } | { hasData: false; data: null }
  },
  ev: RequestEventLoader | RequestEventAction | RequestEvent
) => {
  // // 1. Resolve the backend path from the code
  const backendPath = backendPathResolver(serverData.code)

  // // 2. Access the backend and store the reply as `rawReply`.
  const rawReply = await wretch(`${configPublic.BACKEND_URL}${backendPath}`)
    .headers({ gatekeeper: "3bQdY1mE3agwuYqelMyjoS3GDaTY6iTtpxmg" })
    .post({ payload: serverData.payload })
    .json()
    .catch((err) => wretchErrorHandler(err, ev))

  // 3. Validate the rawReply using a generated full schema capable of validating entire server responses.
  // (see `completeServerOutputSchemaResolver`)
  const validatedData = rawReplyValidator(rawReply, serverData.code, ev)

  // 4. provide type

  return validatedData
}
