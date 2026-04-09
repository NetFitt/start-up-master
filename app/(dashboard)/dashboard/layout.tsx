import { auth } from '@/auth'
import Sidebar from '@/components/dashboard/Sidebar'
import { ExitBanner } from '@/components/dashboard/ExitBanner'
import { ThemeToggle } from './ThemeToggle'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user

  const getRoleDisplay = (role?: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin'
      case 'wilaya_admin': return 'Wilaya Admin'
      case 'baladia_admin': return 'District Admin'
      default: return 'Member'
    }
  }

  return (
    // 🚀 ROOT: Full height flex container
    <div className="h-screen w-full bg-slate-50 dark:bg-[#050805] flex flex-col text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden">
      
      {/* 🚀 1. ABSOLUTE TOP: The Banner sits here and pushes everything else down */}
      {user?.isImpersonating && (
        <div className="shrink-0 z-[60]">
           <ExitBanner name={user.name ?? 'Admin'} />
        </div>
      )}

      {/* 🚀 2. THE APP WRAPPER: Takes the rest of the height */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR: Starts below the banner */}
        {/* <aside className="w-64 shrink-0 sm:hidden md:flex border-r border-slate-200 dark:border-white/5 bg-white/70 dark:bg-black/20 backdrop-blur-xl"> */}
           <Sidebar role={user?.role} />
        {/* </aside> */}

        {/* MAIN AREA: Starts below the banner */}
        <main className="flex-1 min-w-0 flex flex-col h-full relative">
          
          {/* HEADER: Pushed down by the banner */}
          <header className="h-20 shrink-0 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-8 bg-white/80 dark:bg-black/10 backdrop-blur-md sticky top-0 z-40">
            <div className="relative w-96"></div> 
            
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-white/10">
                <div className="text-right flex flex-col">
                  <p className="text-[10px] text-[#22c55e] font-black uppercase tracking-[0.15em] mb-1">
                    {getRoleDisplay(user?.role)}
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-gray-200">
                    {user?.name || 'User'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#22c55e] to-emerald-800 border-2 border-white/10 shadow-md" />
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}