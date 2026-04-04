// src/app/(dashboard)/layout.tsx
import { auth } from '@/auth'
import Sidebar from '@/components/dashboard/Sidebar'
import { Search, Bell } from 'lucide-react'
import { ExitBanner } from '@/components/dashboard/ExitBanner'
import { ThemeToggle } from './ThemeToggle'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user

  return (
    // Changed: Added bg-slate-50 (light) and dark:bg-[#050805] (dark). 
    // Changed: text-slate-900 (light) and dark:text-white (dark)
    <div className="min-h-screen bg-slate-50 dark:bg-[#050805] flex flex-col text-slate-900 dark:text-white font-sans transition-colors duration-300">
      {user?.isImpersonating && <ExitBanner name={user.name ?? 'Admin'} />}

      <div className="flex flex-1">
        <Sidebar role={user?.role} />

        <main className="flex-1 flex flex-col">
          {/* Header: Changed border and bg to be theme-aware */}
          <header className="h-20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-8 bg-white/80 dark:bg-black/10 backdrop-blur-md sticky top-0 z-50">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search expeditions, hunters..." 
                // Changed: Input colors
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#22c55e] transition-all text-slate-900 dark:text-white"
              />
            </div>
           
            <div className="flex items-center gap-6">
              <Bell size={20} className="text-slate-400 cursor-pointer hover:text-[#22c55e]" />
              <ThemeToggle />
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-white/10">
                <div className="text-right">
                  <p className="text-xs text-[#22c55e] font-bold uppercase tracking-widest">
                    {user?.role === 'super_admin' ? 'Super Admin' : 'Wilaya Admin'}
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-gray-200">{user?.name || 'User'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#22c55e] to-emerald-800 border-2 border-white/10 shadow-sm" />
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