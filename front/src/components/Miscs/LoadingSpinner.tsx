import { component$ } from "@builder.io/qwik"
import { IconLoading } from "./Icons"

export const LoadingSpinner = component$(() => {
  return (
    <div class="flex items-center spinner">
      <IconLoading />
    </div>
  )
})
