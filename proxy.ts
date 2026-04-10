// src/middleware.ts
import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  
  const isLoginPage = nextUrl.pathname === "/login"
  
  // 🚀 1. Add your new page here
  const publicRoutes = ["/", "/apply-association", "/offers"] 
  
  // 🚀 2. Change .includes to .some and startsWith if you want to allow sub-pages (like details)
  const isPublicRoute = publicRoutes.some((route) => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith("/offers/")
  )
  
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