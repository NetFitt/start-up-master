import { DM_Sans } from 'next/font/google'
import { LoginClient } from './login-client'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-dm',
  display: 'swap',
})

export const metadata = {
  title: 'Login | DZHUNT Algeria',
  description: 'National Hunting Management System - Member Access',
}

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) redirect('/dashboard')

  return (
    <main className={`${dmSans.variable} font-sans`}>
      <LoginClient />
    </main>
  )
}