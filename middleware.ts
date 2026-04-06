// src/middleware.ts
import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  const isLoginPage = nextUrl.pathname === "/login"
  
  if (!isLoggedIn && !isLoginPage) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  if (isLoggedIn && isLoginPage) {
    return Response.redirect(new URL("/dashboard", nextUrl))
  }

  return null
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}