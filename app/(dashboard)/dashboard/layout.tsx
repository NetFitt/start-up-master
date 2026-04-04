// src/app/(dashboard)/layout.tsx
import { auth } from '@/auth'
import Sidebar from '@/components/dashboard/Sidebar'
import { Search, Bell } from 'lucide-react'
import { ExitBanner } from '@/components/dashboard/ExitBanner'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user

  return (
    <div className="min-h-screen bg-[#050805] flex flex-col text-white font-sans">
      {/* ─── Exit Impersonation Banner ─── */}
      {user?.isImpersonating && <ExitBanner name={user.name ?? 'Admin'} />}

      <div className="flex flex-1">
        {/* ─── Sidebar (Client Component) ─── */}
        <Sidebar role={user?.role} />

        {/* ─── Main Content ─── */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/10 backdrop-blur-md sticky top-0 z-50">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search expeditions, hunters..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#22c55e] transition-all text-white"
              />
            </div>
            
            <div className="flex items-center gap-6">
              <Bell size={20} className="text-gray-400 cursor-pointer hover:text-white" />
              <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                <div className="text-right">
                  <p className="text-xs text-[#22c55e] font-bold uppercase tracking-widest">
                    {user?.role === 'super_admin' ? 'Super Admin' : 'Wilaya Admin'}
                  </p>
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#22c55e] to-emerald-800 border-2 border-white/10" />
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