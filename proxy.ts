// src/middleware.ts
import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  const isLoginPage = nextUrl.pathname === "/login"
  
  // 🚀 UPDATE THIS: The new public path
  const publicRoutes = ["/", "/apply-association"] 
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  if (isLoggedIn && (isLoginPage || nextUrl.pathname === "/")) {
    return Response.redirect(new URL("/dashboard", nextUrl))
  }

  if (!isLoggedIn && !isLoginPage && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  return null
})
export const config = {
  // This tells Next.js to run this logic on every page except static files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}