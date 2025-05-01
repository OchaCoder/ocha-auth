import { component$, createContextId, useContextProvider, useStore, Slot } from "@builder.io/qwik"

export type Toast = { id: number; type: "green" | "yellow" | "red" | "close"; txt: string }
export type AuthCode = "SIGN_IN" | "REGISTER" | "RESET_PASSWORD" | "SETUP_PASSWORD"
export type Ctr = {
  darkMode: boolean
  authCode: AuthCode
  visible: boolean
  loading: boolean
  toast: { count: 0; arr: Toast[] }
  passwordGuide: { hasLength: boolean; hasLetter: boolean; hasNumber: boolean; hasSpecial: boolean }
}

export type UserState = {
  name: string
  email: string
  rpt: string
}

export type BackendHealth = {
  stable: boolean
  suppressGreen: boolean
  fastifyDown: boolean
}

export type GlobalState = {
  ctr: Ctr
  userState: UserState
  backendHealth: BackendHealth
}

export const ContextIdGlobalState = createContextId<GlobalState>("context-id-global-state")

export const ContextProviderGlobalState = component$(() => {
  const globalState = useStore<GlobalState>({
    ctr: {
      darkMode: false,
      authCode: "SIGN_IN",
      visible: false,
      loading: false,
      toast: { count: 0, arr: [] },
      passwordGuide: { hasLength: false, hasLetter: false, hasNumber: false, hasSpecial: false },
    },

    userState: { name: "", email: "", rpt: "" },
    backendHealth: { stable: true, suppressGreen: true, fastifyDown: false },
  })
  useContextProvider(ContextIdGlobalState, globalState)
  return (
    <>
      <Slot />
    </>
  )
})
