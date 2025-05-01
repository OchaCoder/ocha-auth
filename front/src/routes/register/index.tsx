import { component$, useContext, useTask$ } from "@builder.io/qwik"

import { ContextIdGlobalState } from "../../contexts/ContextGlobalState"
import { Home } from "../../components/Home"

// This route renders an exact copy of the homepage.
// The only differences are the URL and that the "REGISTER" modal is open by default.
//
// In modern design, user auth often appears as a modal over a semi-transparent overlay.
// A challenge arises when users directly visit a modal page URL (e.g. '/register/')
// — for example, via bookmark or external link.
//
// Since the modal page is the initial entry point, there’s no page content underneath,
// which can make the experience feel empty or broken.
//
// Some sites handle this by using a static placeholder image behind the modal,
// while others expand the modal to fill the entire screen — often resulting in sparse or awkward layouts.
//
// This design takes a slightly different approach:
// it renders the real homepage underneath the modal overlay,
// so users arriving at '/register/' still see meaningful content and can interact with it immediately,
// even if they close the modal.
//

export default component$(() => {
  const { ctr } = useContext(ContextIdGlobalState)
  useTask$(() => {
    ctr.authCode = "REGISTER"
  })
  return <Home />
})
