'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Users, Loader2 } from "lucide-react"
import { connectToDirectorateAdmin } from "@/lib/actions/impersonation" // Make sure this path is correct!

export function ImpersonateButton({ directorateId }: { directorateId: string }) {
  const [isPending, setIsPending] = useState(false)

  const handleConnect = async () => {
    setIsPending(true)
    try {
      // 1. Call the Server Action to swap the session in the database/cookies
      const result = await connectToDirectorateAdmin(directorateId)
      
      // 2. If successful, FORCE a hard refresh to the dashboard
      if (result?.success) {
        window.location.href = '/dashboard'
      }
    } catch (error: any) {
      console.error("Failed to connect:", error)
      alert(error.message || "Failed to connect. Make sure the admin is seeded.")
      setIsPending(false) // Only stop spinning if it fails
    }
  }

  return (
    <Button 
      onClick={handleConnect}
      disabled={isPending}
      variant="outline" 
      className="border-white/10 cursor-pointer text-gray-300 hover:border-[#22c55e] hover:text-[#22c55e] hover:bg-[#22c55e]/10 gap-2.5 rounded-xl px-5 transition h-10"
    >
      {isPending ? (
        <Loader2 size={18} className="animate-spin text-[#22c55e]" />
      ) : (
        <Users size={18} className="text-[#22c55e]" />
      )}
      {isPending ? "Connecting..." : "Connect as Admin"}
    </Button>
  )
}