'use client'

// Removed unstable_update as it is not a valid export from "next-auth/react"
import { useRouter } from "next/navigation"

export function ExitBanner({ name }: { name: string }) {
  const router = useRouter()

  const handleExit = async () => {
    // Removed unstable_update call as it is not a valid function
    router.push('/dashboard/directorates')
    router.refresh()
  }

  return (
    <div className="bg-[#22c55e] text-black py-2 px-8 flex justify-between items-center sticky top-0 z-[100] font-bold shadow-lg">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
        <span className="bg-black text-white px-1.5 py-0.5 rounded">Impersonating</span>
        <span>{name}</span>
      </div>
      <button 
        onClick={handleExit}
        className="text-xs underline hover:no-underline cursor-pointer"
      >
        Restore Super Admin Access ↩
      </button>
    </div>
  )
}