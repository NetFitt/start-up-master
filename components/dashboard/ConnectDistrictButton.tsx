'use client'

import { useTransition } from 'react'
import { connectToDistrictAdmin } from "@/lib/actions/impersonation"
import { Button } from "@/components/ui/button"
import { MonitorPlay, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ConnectDistrictButton({ 
  districtId, 
  districtName 
}: { 
  districtId: string, 
  districtName: string 
}) {
  const [isPending, startTransition] = useTransition()

  const handleConnect = () => {
    startTransition(async () => {
      try {
        const res = await connectToDistrictAdmin(districtId)
        if (res.success) {
          toast.success(`Now managing ${districtName}`)
          // Hard reload to refresh all server components with new session context
          window.location.href = "/dashboard"
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to connect")
      }
    })
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      disabled={isPending}
      onClick={handleConnect}
      className="gap-2 border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e] hover:text-black rounded-lg font-bold transition-all"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <MonitorPlay size={16} />
          Connect as Admin
        </>
      )}
    </Button>
  )
}