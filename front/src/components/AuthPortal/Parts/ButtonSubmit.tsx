// import { $, component$, useContext, useTask$ } from "@builder.io/qwik"
// import { useNavigate } from "@builder.io/qwik-city"
// import { ContextIdGlobalState } from "../../../contexts/ContextGlobalState"
// import { txtGeneral } from "../../../texts"
// import { useUserRegisterAction } from "../../../routes/register/use-user-register-action"
// import { useUserSignInAction } from "../../../routes/signin/use-user-signin-action"
// import { useUserResetPasswordAction } from "../../../routes/reset/request/use-user-forgot-password-action"
// import { useUserSetupPasswordAction } from "../../../routes/reset/password-setup"
// import { outputUserRegisterActionSchema } from "../../../routes/register/zod-schemas"
// import { outputUserSignInActionSchema } from "../../../routes/signin/zod-schemas"
// import { replySuccessBoolSchema } from "../../../routes/zod-schema"
// import { LoadingSpinner } from "../../../components/Miscs/LoadingSpinner"
// import { inputChecker } from "./on-submit-input-checker"
// import { addToast } from "~/helper-functions/toast-manager"
// import { payloadGenerator } from "../../../helper-functions/fetch-resolver-suite/resolvers/server-input-data-resolver"
// import { BackendOpCode } from "~/helper-functions/fetch-resolver-suite/backend-op-codes"

// export const ButtonSubmit = component$(({ backendOpCode, payload }: { backendOpCode: BackendOpCode; payload: unknown }) => {
//   const { ctr, userState, backendHealth } = useContext(ContextIdGlobalState)
//   const nav = useNavigate()
//   const userRegisterAction = useUserRegisterAction()
//   const userSignInAction = useUserSignInAction()
//   const userResetPasswordAction = useUserResetPasswordAction()
//   const userSetupPasswordAction = useUserSetupPasswordAction()

//   useTask$(({ track }) => {
//     // 1. Trigger task if action is done.
//     track(() => userRegisterAction.value)
//     track(() => userSignInAction.value)
//     track(() => userResetPasswordAction.value)
//     track(() => userSetupPasswordAction.value)

//     // 2.
//     // Skip first render where all actions are null.
//     // This useTask runs once on mount, so we only continue
//     // if at least one action has a value (indicating a user interaction).

//     if (!userRegisterAction.value && !userSignInAction.value && !userResetPasswordAction.value && !userSetupPasswordAction.value) return

//     // 3. Identify which action ran
//     // 3-1. Register User
//     if (userRegisterAction.value) {
//       try {
//         const validatedOutput = outputUserRegisterActionSchema.parse(userRegisterAction.value)
//         // 3-1-2: Register User was successful
//         if (validatedOutput.success) {
//           userState.name = validatedOutput.payload.userName
//           nav("/account/dashboard") // 3-1-3: Navigate the user to dashboard
//         }

//         // Register User was NOT successful
//         else {
//           addToast(ctr.toast, validatedOutput.errorAction.type, validatedOutput.errorAction.message)
//         }
//       } catch {
//         // Validation failed
//       }
//     }
//     // 3-2. SignIn User
//     else if (userSignInAction.value) {
//       try {
//         const validatedOutput = outputUserSignInActionSchema.parse(userSignInAction.value)
//         // 3-2-2: Sign-in was successful
//         if (validatedOutput.success) {
//           userState.name = validatedOutput.payload.userName
//           nav("/account/dashboard") // 3-2-3: Navigate the user to dashboard
//         }
//         // Sign-in was NOT successful
//         else addToast(ctr.toast, validatedOutput.errorAction.type, validatedOutput.errorAction.message)
//       } catch {
//         // routeAction's zod schema validation failed.
//         // Action is returning data, but validation is failing.
//         // Unknown Case.
//       }
//     }
//     // 3-3. Requesting reset password email
//     else if (userResetPasswordAction.value) {
//       // Action always returns { success: true } or { success: false }
//       // Regardless of result, redirect to the same path for security.
//       nav("/reset/request/complete/")
//     }
//     // 3-4. Setting up new password
//     else if (userSetupPasswordAction.value) {
//       // Password is changed successfully
//       if (userSetupPasswordAction.value.success) nav("/reset/complete/")
//       // Impossible to reach with the current code base.
//       // Safety net for future updates.
//       else nav("/oops")
//     }
//   })

//   const labelMap = {
//     SIGN_IN: txtGeneral.signIn,
//     REGISTER: txtGeneral.signUp,
//     RESET_PASSWORD: txtGeneral.resetPassword,
//     SETUP_PASSWORD: "Reset Password",
//   }

//   const runAction = $(async (payload: any) => {
//     ctr.loading = true
//     if (ctr.authCode === "SIGN_IN") await userSignInAction.submit(payload)
//     else if (ctr.authCode === "REGISTER") await userRegisterAction.submit(payload)
//     else if (ctr.authCode === "RESET_PASSWORD") await userResetPasswordAction.submit(payload)
//     else if (ctr.authCode === "SETUP_PASSWORD") await userSetupPasswordAction.submit(payload)
//     else null
//     ctr.loading = false
//   })

//   const buttonLabel = labelMap[ctr.authCode]

//   return (
//     <>
//       <div
//         class={`button color-dual-light ${!backendHealth.stable ? `bg-disabled` : `bg-theme hover-bg-theme`}`}
//         onClick$={async () => {
//           // Only enable button click when both Postgres and Redis are stable.
//           if (!backendHealth.stable) return

//           // perform input check before enabling button click.
//           const { empty, format, shake } = await inputChecker(ctr, requestSource)
//           shake()
//           if (!(await empty())) return // return if any input fields are empty.

//           if (!(await format())) return // return if inputs are invalid.

//           const request = requestGenerator(backendOpCode, payload)

//           await runAction(payload)
//         }}>
//         {ctr.loading ? <LoadingSpinner /> : buttonLabel}
//       </div>
//     </>
//   )
// })
