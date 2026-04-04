import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/db'
import { users } from '@/db/schema/auth'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// We add 'unstable_update' to the exports so we can call it from Server Actions
declare module "next-auth" {
  // 1. Extend the User object
  interface User {
    role?: string
    directorate_id?: string | null
    department_id?: string | null
    association_id?: string | null
    isImpersonating?: boolean
  }
  interface JWT {
    id: string
    role: string
    directorate_id: string | null
    department_id: string | null
    association_id: string | null
    isImpersonating: boolean
    originalId?: string
    originalName?: string | null
  }
  // 2. Extend the Session object (This fixes the 'action' error)
  interface Session {
    action?: "IMPERSONATE" | "EXIT"
    targetId?: string
    targetName?: string
    targetDirectorateId?: string
    user: {
      id: string
      role: string
      directorate_id: string | null
      department_id: string | null
      association_id: string | null
      isImpersonating: boolean
    } & DefaultSession["user"]
  }
}
export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email:    { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        })

        if (!user || !user.is_active) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        )
        if (!valid) return null

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Initial Sign In
      if (user) {
        token.id             = user.id
        token.role           = (user as any).role
        token.directorate_id = (user as any).directorate_id
        token.department_id  = (user as any).department_id
        token.association_id = (user as any).association_id
        token.isImpersonating = false
      }

      // 2. Handle "Connect As Admin" (Impersonation Trigger)
      if (trigger === "update" && session?.action === "IMPERSONATE") {
        // Save the Super Admin's original ID so we can "Switch Back" later
        if (!token.isImpersonating) {
           token.originalId = token.id
           token.originalName = token.name
        }
        
        token.id              = session.targetId
        token.name            = session.targetName
        token.role            = 'wilaya_admin'
        token.directorate_id  = session.targetDirectorateId
        token.isImpersonating = true
      }

      // 3. Handle "Switch Back" (Restore Super Admin)
      if (session?.action === "EXIT") {
        token.isImpersonating = false;
        token.id = token.originalId; // Give Mohamed his ID back
        token.role = 'super_admin';
        token.name = "Mohamed"; // Or however you store the original name
        token.directorate_id = null;
        delete token.originalId; // Clean up
      }

      return token
    },

    async session({ session, token }) {
      // Expose the active identity and the impersonation state to the frontend
      if (session.user) {
        session.user.id              = token.id as string
        session.user.role            = token.role as string
        session.user.directorate_id  = token.directorate_id as string
        session.user.department_id   = token.department_id as string
        session.user.association_id  = token.association_id as string
        session.user.isImpersonating = !!token.isImpersonating
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})