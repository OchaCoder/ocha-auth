import { type RequestHandler } from "@builder.io/qwik-city"

// This plugin adds trailing slash for all request if it doesn't have one.

export const onRequest: RequestHandler = async ({ redirect, next, pathname }) => {
  if (!pathname.endsWith("/")) throw redirect(301, `${pathname}/`)
}
