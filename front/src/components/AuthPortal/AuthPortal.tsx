import { component$, useContext } from "@builder.io/qwik"
import { ContextIdGlobalState } from "../../contexts/ContextGlobalState"
import { Register } from "../../routes/register/Register"
import { SignIn } from "../../routes/sign-in/SignIn"
import { ResetPassword } from "../../routes/reset/request/ResetPassword"

const contentsComponentMap = {
  REGISTER: <Register />,
  SIGN_IN: <SignIn />,
  RESET_PASSWORD: <ResetPassword />,
  SETUP_PASSWORD: null,
}
export const AuthPortal = component$(() => {
  const { ctr } = useContext(ContextIdGlobalState)

  return <>{contentsComponentMap[ctr.authCode]}</>
})
