import { routeAction$, z, zod$ } from "@builder.io/qwik-city"

// eslint-disable-next-line qwik/loader-location
export const useAction = routeAction$(async () => {
  setTimeout(() => {
    console.log("Action is Pressed🫶🏻🌸🌸🌻🫶🏻🌸🌸🌻")
    return { data: "Hello! I came from useAction:)" } as { data: string }
  }, 3000)
})

// eslint-disable-next-line qwik/loader-location
export const useAddUser = routeAction$(
  async (user) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          payload: { success: true, userID: `My user ID is this!🫶🏻🌻 and this came from payload: ${user.name}` },
        })
      }, 2000)
    })
    //   return { success: true, userID: "666" }
  },
  zod$({ name: z.string() })
)
