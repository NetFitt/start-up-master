'use client'

import { motion } from 'framer-motion'
import { LayoutDashboard, Users, Shield, Settings, LogOut, Building } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function Sidebar({ role }: { role?: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl hidden lg:flex flex-col p-6 sticky top-0 h-screen">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-[#22c55e] rounded flex items-center justify-center text-black">
          <Shield size={18} />
        </div>
        <span className="font-bold tracking-tighter text-xl">YOUHUNT</span>
      </div>

      <nav className="flex-1 space-y-2">
        <SidebarItem 
          href="/dashboard" 
          icon={<LayoutDashboard size={20} />} 
          label="Overview" 
          active={pathname === '/dashboard'} 
        />

        {/* Super Admin Links */}
        {role === 'super_admin' && (
          <SidebarItem 
            href="/dashboard/directorates" 
            icon={<Users size={20} />} 
            label="Directorates" 
            active={pathname.startsWith('/dashboard/directorates')} 
          />
        )}

        {/* Wilaya Admin Links */}
        {role === 'wilaya_admin' && (
          <SidebarItem 
            href="/dashboard/departments" 
            icon={<Building size={20} />} 
            label="My Departments" 
            active={pathname.startsWith('/dashboard/departments')} 
          />
        )}

        {/* <SidebarItem 
          href="/dashboard/settings" 
          icon={<Settings size={20} />} 
          label="Settings" 
          active={pathname === '/dashboard/settings'} 
        /> */}
      </nav>

      <div className="pt-6 border-t border-white/5">
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })} 
          className="flex cursor-pointer items-center gap-3 text-gray-500 hover:text-red-400 transition-colors w-full px-2"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}

function SidebarItem({ href, icon, label, active = false }: { href: string, icon: any, label: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
      {icon}
      <span className="font-medium">{label}</span>
      {active && <motion.div layoutId="pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#22c55e]" />}
    </Link>
  )
}