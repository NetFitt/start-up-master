// src/middleware.ts
import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  
  const isLoginPage = nextUrl.pathname === "/login"
  
  // Routes anyone can see
  const publicRoutes = ["/", "/apply-association", "/offers"] 
  
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
  // 🚀 THE FIX: Add 'images' to the exclusion list below
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
}