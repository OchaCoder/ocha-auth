import { $, component$, useContext, useStore } from "@builder.io/qwik"
import { ContextIdGlobalState } from "../../../contexts/ContextGlobalState"
import { LoadingSpinner } from "../../../components/Miscs/LoadingSpinner"
import { IconArrowRight } from "../../../components/Miscs/Icons"
import { Link, RequestEventLoader, routeAction$, routeLoader$, useNavigate, z, zod$ } from "@builder.io/qwik-city"
import { backendOpCode } from "../../../helper-functions/fetch-resolver-suite/backend-op-codes"
import { serverInputDataResolver } from "../../../helper-functions/fetch-resolver-suite/resolvers/server-input-data-resolver"
import { wretchResolverProtected } from "../../../helper-functions/fetch-resolver-suite/wretch-resolver-protected"
import { addToast } from "../../../helper-functions/toast-manager"
import { setCookieFromClient } from "../../../helper-functions/set-cookie-helpers"

export const useLoader = routeLoader$(async (ev: RequestEventLoader) => {
  const code = backendOpCode.protected.loader.LOAD_PROTECTED_USER_EDIT
  const serverData = serverInputDataResolver(code)
  const validatedReply = await wretchResolverProtected(serverData, ev)

  if (!validatedReply || !validatedReply.success) throw ev.redirect(303, "/oops")

  return validatedReply
})

export const useUserUpdateAction = routeAction$(
  async (serverInject, ev) => {
    const code = backendOpCode.protected.action.ACTION_PROTECTED_USER_UPDATE

    const serverData = serverInputDataResolver(code, serverInject)

    const validatedReply = await wretchResolverProtected(serverData, ev)

    return validatedReply
  },
  zod$(
    z.object({
      oldValues: z.object({
        name: z.string(),
        email: z.string(),
      }),
      newValues: z.object({
        name: z.string(),
        email: z.string(),
      }),
    })
  )
)

export default component$(() => {
  const { ctr, userState, backendHealth } = useContext(ContextIdGlobalState)
  // 1. Load the initial data for displaying the page.
  const data = useLoader().value.data

  // 2. Create stores for user inputs and initialize them with the loaded values (current `name` and `email`).
  const newName = useStore({ value: data.name, fx: false })
  const newEmail = useStore({ value: data.email, fx: false })

  // 3. Create an instance of an `routeAction$` and prepare for the backend operation.
  const action = useUserUpdateAction()

  // 4. If submit button is clicked, create the `serverInject` payload and trigger `routeAction$`.
  const runSubmit = $(async () => {
    // 4-1. Create `serverInject` object.
    const serverInject = {
      oldValues: { name: data.name, email: data.email },
      newValues: {
        // If the value has become empty due to user input, assign the current value.
        name: newName.value === "" ? data.name : newName.value,
        email: newEmail.value === "" ? data.email : newEmail.value,
      },
    }
    // 4-2. Submit the serverInject
    await action.submit(serverInject)

    if (action.value?.success === true) {
      console.log("action.value.data.userData.name.newValue", action.value.data.userData.name.newValue)
      userState.name = action.value.data.userData.name.newValue
      setCookieFromClient("uid", btoa(action.value.data.userData.name.newValue), 60 * 60 * 24 * 30 * 6)
    } else if (action.value?.success === false) addToast(ctr.toast, action.value.errorAction.type, action.value.errorAction.message)
  })

  const UpdateUser = component$(() => {
    const nav = useNavigate()
    return (
      <div class="grid justify-center" style={{ gap: "40px" }}>
        <div class="grid justify-center" style={{ gap: "20px" }}>
          <h2 class={`font-size-16 color-theme`} style={{ paddingTop: "20px" }}>
            Change your info
          </h2>
          <div class="flex flex-column items-center" style={{ gap: "30px" }}>
            <div class="input-theme">
              <label class={newName.value && "input-has-data"}>Your name</label>
              <input type="text" value={newName.value} onInput$={(_, e: HTMLInputElement) => (newName.value = e.value)} />
            </div>

            <div class="input-theme">
              <label class={newEmail.value && "input-has-data"}>Your email</label>
              <input type="text" value={newEmail.value} onInput$={(_, e: HTMLInputElement) => (newEmail.value = e.value)} />
            </div>
            <div class={`flex`} style={{ gap: "20px" }}>
              <div
                class={`button  color-dual-light  ${backendHealth.stable ? `bg-green hover-bg-green` : `bg-disabled`}`}
                onClick$={() => {
                  if (backendHealth.stable) runSubmit()
                }}>
                {action.isRunning ? <LoadingSpinner /> : `Save Changes`}
              </div>
              <div
                onClick$={() => {
                  if (backendHealth.stable) nav("/account/dashboard")
                }}
                class={`button  color-dual-light  ${backendHealth.stable ? `bg-theme hover-bg-theme` : `bg-disabled`}`}>
                Cancel
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  })

  const UpdateCompleted = component$(() => {
    return (
      <>
        {action.value?.success && (
          <div class={`flex flex-column items-center`} style={{ marginTop: "20px", gap: "20px" }}>
            <h2 class={`font-size-16 color-theme`}>Changes saved</h2>
            <div class={`grid`} style={{ gap: "30px", border: "solid var(--theme) 1px", padding: "30px 20px" }}>
              <div class={`grid`} style={{ gridTemplateColumns: "1fr 50px 1fr ", alignItems: "center" }}>
                <div class="grid" style={{ rowGap: "10px" }}>
                  <div class={`font-size-9 italic text-center`}>Old Name</div>
                  <div class={`font-size-13 italic text-center`}>{action.value.data.userData.name.oldValue}</div>
                </div>
                <div class={`text-center`}>
                  <IconArrowRight />
                </div>
                <div class="grid" style={{ rowGap: "10px" }}>
                  <span class={`font-size-9 italic text-center`}>New Name</span>
                  <span class={`font-size-13 color-theme italic text-center`}>{action.value.data.userData.name.newValue}</span>
                </div>
              </div>

              <div class={`grid`} style={{ gridTemplateColumns: "1fr 50px 1fr ", alignItems: "center" }}>
                <div class="grid" style={{ rowGap: "10px" }}>
                  <div class={`font-size-9 italic text-center`}>Old Email</div>
                  <div class={`font-size-13 italic text-center`}>{action.value.data.userData.email.oldValue}</div>
                </div>
                <div class={`text-center`}>
                  <IconArrowRight />
                </div>
                <div class="grid" style={{ rowGap: "10px" }}>
                  <div class={`font-size-9 italic text-center`} style={{ textAlign: "center", paddingBottom: "10px" }}>
                    New Email
                  </div>
                  <div class={`font-size-13 color-theme italic text-center`}>{action.value.data.userData.email.newValue}</div>
                </div>
              </div>
            </div>
            <Link href="/account/dashboard" class={`button bg-theme color-dual-light`}>
              Dashboard
            </Link>
          </div>
        )}
      </>
    )
  })

  return <>{action.value?.success ? <UpdateCompleted /> : <UpdateUser />}</>
})
