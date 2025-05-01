import { server$, type Cookie, type CookieOptions } from "@builder.io/qwik-city"

// Set cookies exclusively from server-side
// 1. Enhances security
// 2. Mitigates browser-imposed maxAge limits (though not entirely)

// For server-side use
export const setCookieFromServer = (cookie: Cookie, cookieName: string, cookieValue: string, maxAge?: number) => {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "strict",
    ...(maxAge && { maxAge }), // Includes maxAge only if it's a positive number (prevents accidental expiration)
  }

  cookie.set(cookieName, cookieValue, cookieOptions)
}

// For client-side use
export const setCookieFromClient = server$(function (cookieName: string, cookieValue: string, maxAge?: number) {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "strict",
    ...(maxAge && { maxAge }), // Includes maxAge only if it's a positive number (prevents accidental expiration)
  }

  this.cookie.set(cookieName, cookieValue, cookieOptions)
})
