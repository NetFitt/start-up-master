import { auth } from "@/auth"
import { getAllowedDairasForWilaya } from "@/lib/actions/offers"
import { redirect } from "next/navigation"
import OfferStepper from "./offer-stepper"

export default async function NewOfferPage() {
  const session = await auth()
  
  // Security: Only Wilaya Admins
  if (session?.user?.role !== 'wilaya_admin') {
    redirect('/dashboard')
  }

  // Get the Dairas for the dropdown
  const allowedDairas = await getAllowedDairasForWilaya()

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
          New Hunting <span className="text-[#22c55e]">Package</span>
        </h1>
        <p className="text-gray-500 font-medium">
          Create an official territory offer for the 2026 season.
        </p>
      </div>

      <OfferStepper dairas={allowedDairas} />
    </div>
  )
}