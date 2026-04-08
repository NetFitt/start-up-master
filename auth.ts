// src/auth.ts
import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/db'
import { users } from '@/db/schema/auth'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import authConfig from "./auth.config"

declare module "next-auth" {
  interface User {
    role?: string
    directorate_id?: string | null
    forest_district_id?: string | null
    association_id?: string | null // 🚀 Added: For Association Admins
    location_id?: number | null
  }

  interface Session {
    user: {
      id: string
      role: string
      directorate_id: string | null
      forest_district_id: string | null
      association_id: string | null // 🚀 Added
      location_id: number | null
      isImpersonating: boolean
    } & DefaultSession["user"]
  }
}

// Note: If you have a separate JWT declaration, ensure association_id is there too.

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

        // Ensure user exists, is active, and has a password
        if (!user || !user.is_active || !user.password_hash) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        )

        if (!valid) return null

        // 🚀 RETURN ALL CONTEXTS
        // This data goes to the 'jwt' callback in auth.config.ts
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role ?? undefined,
          directorate_id: user.directorate_id,
          forest_district_id: user.forest_district_id,
          association_id: user.association_id, // 🚀 Pass the link to the club
          location_id: user.location_id,
        }
      },
    }),
  ],
})