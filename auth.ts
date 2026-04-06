import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/db'
import { users } from '@/db/schema/auth'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import authConfig from "./auth.config"

// We add 'unstable_update' to the exports so we can call it from Server Actions
declare module "next-auth" {
  interface User {
    role?: string
    directorate_id?: string | null
    forest_district_id?: string | null // 🚀 Added
    location_id?: number | null       // 🚀 Added
  }

  interface JWT {
    id: string
    role: string
    directorate_id: string | null
    forest_district_id: string | null
    location_id: number | null
    isImpersonating: boolean
    // Store the "Home" identity
    origin?: {
      id: string
      role: string
      name: string | null
    }
  }

  interface Session {
    user: {
      id: string
      action?: "IMPERSONATE" | "EXIT",
      role: string
      directorate_id: string | null
      forest_district_id: string | null
      location_id: number | null
      isImpersonating: boolean
    } & DefaultSession["user"]
  }
}
export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    Credentials({
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

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || undefined,
          directorate_id: user.directorate_id,
        }
      },
    }),
  ],
})