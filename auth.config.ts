// src/auth.config.ts
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export default {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Initial Login
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.name = user.name
        token.directorate_id = (user as any).directorate_id
        token.forest_district_id = (user as any).forest_district_id
        token.isImpersonating = false
        
        // Permanent backup of who you REALLY are
        token.originalId = user.id
        token.originalRole = (user as any).role
        token.originalName = user.name
      }

      // 2. Handle Impersonation Update
      // 🚀 The keys here MUST match what you pass in unstable_update 🚀
      if (trigger === "update" && session?.action === "IMPERSONATE") {
        token.id = session.targetId
        token.name = session.targetName
        token.role = session.targetRole || 'wilaya_admin'
        token.directorate_id = session.targetDirectorateId // This was likely missing!
        token.forest_district_id = session.targetForestDistrictId
        token.isImpersonating = true
      }

      // 3. Handle Exit
      if (trigger === "update" && session?.action === "EXIT") {
        token.id = token.originalId
        token.name = token.originalName as string
        token.role = token.originalRole
        token.directorate_id = (token.originalRole === 'super_admin') ? null : token.directorate_id
        token.forest_district_id = null
        token.isImpersonating = false
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.name = token.name as string
        // 🚀 PASS THE ID TO THE SESSION 🚀
        session.user.directorate_id = token.directorate_id as string
        session.user.forest_district_id = token.forest_district_id as string
        session.user.isImpersonating = !!token.isImpersonating
      }
      return session
    },
  },
  providers: [], // We will fill this in auth.ts
} satisfies NextAuthConfig