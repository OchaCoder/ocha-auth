import { component$ } from "@builder.io/qwik"
import { useLocation } from "@builder.io/qwik-city"

export default component$(() => {
  const loc = useLocation()
  const path = loc.params.all

  return <>{`Sorry! ${path} is not one of our paths.`}</>
})
