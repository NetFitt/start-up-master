// src/app/(dashboard)/layout.tsx
import { auth } from '@/auth'
import Sidebar from '@/components/dashboard/Sidebar'
import { Bell } from 'lucide-react'
import { ExitBanner } from '@/components/dashboard/ExitBanner'
import { ThemeToggle } from './ThemeToggle'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user

  // Helper to show the correct rank in the header
  const getRoleDisplay = (role?: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin'
      case 'wilaya_admin': return 'Wilaya Admin'
      case 'baladia_admin': return 'District Admin'
      default: return 'Member'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050805] flex flex-col text-slate-900 dark:text-white font-sans transition-colors duration-300">
      {/* 🚀 Impersonation Banner: Now supports all 3 levels */}
      {user?.isImpersonating && <ExitBanner name={user.name ?? 'Admin'} />}

      <div className="flex flex-1">
        <Sidebar role={user?.role} />

        <main className="flex-1 flex flex-col">
          <header className="h-20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-8 bg-white/80 dark:bg-black/10 backdrop-blur-md sticky top-0 z-50">
            <div className="relative w-96">
               {/* Search placeholder - keeping it clean for now */}
            </div> 
            
            <div className="flex items-center gap-6">
              <div className="relative cursor-pointer group">
                <Bell size={20} className="text-slate-400 group-hover:text-[#22c55e] transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#22c55e] rounded-full border-2 border-white dark:border-[#050805]" />
              </div>

              <ThemeToggle />

              <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-white/10">
                <div className="text-right flex flex-col">
                  {/* 🚀 UPDATED: Dynamic Role Label */}
                  <p className="text-[10px] text-[#22c55e] font-black uppercase tracking-[0.15em] leading-none mb-1">
                    {getRoleDisplay(user?.role)}
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-gray-200 leading-none">
                    {user?.name || 'User'}
                  </p>
                </div>
                
                {/* Avatar with status ring */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#22c55e] to-emerald-800 border-2 border-white/10 shadow-md ring-2 ring-[#22c55e]/10" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22c55e] border-2 border-white dark:border-[#050805] rounded-full" />
                </div>
              </div>
            </div>
          </header>

          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}