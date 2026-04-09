// src/app/(dashboard)/dashboard/offers/[id]/edit/page.tsx
import { auth } from "@/auth"
import { getOfferById, getAllowedDairasForWilaya } from "@/lib/actions/offers"
import { redirect, notFound } from "next/navigation"
import EditOfferStepper from "./edit-offer-stepper"

export default async function EditOfferPage({ 
  params 
}: { 
  params: Promise<{ id: string }> // 🚀 Define it as a Promise
}) {
  // 1. Await the params to "unwrap" the ID
  const { id } = await params 

  const session = await auth()
  if (session?.user?.role !== 'wilaya_admin') redirect('/dashboard')

  // 2. Use the unwrapped 'id'
  const offer = await getOfferById(id)
  if (!offer) notFound()

  const allowedDairas = await getAllowedDairasForWilaya()

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-1 px-4 md:px-0">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
          Edit <span className="text-[#22c55e]">Package</span>
        </h1>
        <p className="text-gray-500 font-medium">Updating details for: {offer.title}</p>
      </div>

      <EditOfferStepper initialData={offer} dairas={allowedDairas} />
    </div>
  )
}