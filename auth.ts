// src/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/db'
import { users } from '@/db/schema/auth'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: 'jwt' }, // JWT so we can embed role in the token
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
    async jwt({ token, user }) {
      // runs on sign in — embed role + entity IDs into the token
      if (user) {
        token.id             = user.id
        token.role           = (user as any).role
        token.wilaya_id      = (user as any).wilaya_id
        token.daira_id       = (user as any).daira_id
        token.association_id = (user as any).association_id
      }
      return token
    },
    async session({ session, token }) {
      // expose them on the session object your components can read
      session.user.id             = token.id as string
      session.user.role           = token.role as string
      session.user.wilaya_id      = token.wilaya_id as string
      session.user.daira_id       = token.daira_id as string
      session.user.association_id = token.association_id as string
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})