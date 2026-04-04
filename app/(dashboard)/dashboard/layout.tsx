'use client'

import { motion } from 'motion/react'
import { LayoutDashboard, Users, Map, Shield, Settings, LogOut, Search, Bell } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: '/login', // Redirects here after clearing the session
      redirect: true 
    })
  }
  return (
    <div className="min-h-screen bg-[#050805] flex text-white font-sans">
      {/* ─── Sidebar ─── */}
      <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl hidden lg:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-[#22c55e] rounded flex items-center justify-center text-black">
            <Shield size={18} />
          </div>
          <span className="font-bold tracking-tighter text-xl">YOUHUNT</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem href='/dashboard'  icon={<LayoutDashboard size={20} />} label="Overview" active={pathname === '/dashboard'} />
          <SidebarItem  href='/dashboard/directorates' icon={<Users size={20} />} label="Directorates" active={pathname.startsWith('/dashboard/directorates')} />
          
        </nav>

        <div className="pt-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex cursor-pointer items-center gap-3 text-gray-500 hover:text-red-400 transition-colors w-full px-2">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/10 backdrop-blur-md sticky top-0 z-50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search expeditions, hunters..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#22c55e] transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <Bell size={20} className="text-gray-400 cursor-pointer hover:text-white" />
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right">
                <p className="text-xs text-[#22c55e] font-bold uppercase tracking-widest">Super Admin</p>
                <p className="text-sm font-medium">Mohamed</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#22c55e] to-emerald-800 border-2 border-white/10" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

function SidebarItem({href , icon, label, active = false }: {  href: string ,icon: any, label: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
      {icon}
      <span className="font-medium">{label}</span>
      {active && <motion.div layoutId="pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#22c55e]" />}
    </Link>
  )
}