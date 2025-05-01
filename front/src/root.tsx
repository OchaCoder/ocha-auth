import { component$ } from "@builder.io/qwik"
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city"
import { RouterHead } from "./components/router-head/router-head"
import { isDev } from "@builder.io/qwik"

import "./styles/00-reset.css"
import "./styles/01-variables.css"
import "./styles/02-elements.css"
import "./styles/03-globals.css"
import "./styles/04-utilities.css"
import "./styles/05-animations.css"
import { ContextProviderGlobalState } from "./contexts/ContextGlobalState"

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && <link rel="manifest" href={`${import.meta.env.BASE_URL}manifest.json`} />}
        <RouterHead />
      </head>
      <body lang="en">
        <ContextProviderGlobalState>
          <RouterOutlet />
        </ContextProviderGlobalState>
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikCityProvider>
  )
})
