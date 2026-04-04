'use client'

import { useState } from 'react'
import { useRouter } from "next/navigation"
import { restoreSuperAdminAccess } from "@/lib/actions/impersonation"
import { Loader2 } from "lucide-react"

export function ExitBanner({ name }: { name: string }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleExit = async () => {
    setIsPending(true)
    try {
      const result = await restoreSuperAdminAccess()
      
      if (result.success) {
        // 🚀 THE FIX: Force a hard reload to the directorates page
        // This ensures the session is re-read from the updated cookie
        window.location.href = '/dashboard/directorates'
      }
    } catch (error) {
      console.error("Failed to restore access", error)
      setIsPending(false)
    }
  }

  return (
    <div className="bg-[#22c55e] text-black py-2.5 px-8 flex justify-between items-center sticky top-0 z-[100] font-bold shadow-xl border-b border-black/10 transition-colors">
      <div className="flex items-center gap-3 text-xs uppercase tracking-widest">
        <span className="bg-black text-white px-2 py-0.5 rounded-md text-[10px] animate-pulse">
          IMPERSONATING
        </span>
        <span className="font-extrabold">{name}</span>
      </div>
      
      <button 
        onClick={handleExit}
        disabled={isPending}
        className="text-xs flex items-center gap-2 bg-black/5 hover:bg-black/10 px-3 py-1 rounded-full transition-all cursor-pointer border border-black/5"
      >
        {isPending ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Restoring Mohamed...
          </>
        ) : (
          <>
            Restore Super Admin Access 
            <span className="text-lg leading-none">↩</span>
          </>
        )}
      </button>
    </div>
  )
}