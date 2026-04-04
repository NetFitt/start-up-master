// src/types/next-auth.d.ts
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id:             string
      role:           string
      wilaya_id:      string | null
      daira_id:       string | null
      association_id: string | null
    } & DefaultSession['user']
  }
}