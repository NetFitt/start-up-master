import { auth } from "@/auth"
import { db } from "@/db"
import { offers } from "@/db/schema/offers"
import { eq, desc } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import OffersTable from "./offers-table"

export default async function WilayaOffersPage() {
  const session = await auth()
  
  // Security: Only Wilaya Admins (or Super Admins)
  if (!['super_admin', 'wilaya_admin'].includes(session?.user?.role!)) {
    redirect('/dashboard')
  }

  const wilayaId = session?.user.directorate_id

  // Fetch offers with their associated Daira info
  const allOffers = await db.query.offers.findMany({
    where: wilayaId ? eq(offers.wilayaId, wilayaId) : undefined,
    with: {
      daira: true, // Assuming you set up relations in your schema
    },
    orderBy: [desc(offers.createdAt)],
  })

  return (
    <div className="space-y-8">
      <div className="flex  md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
            Territory Offers
          </h1>
          <p className="text-gray-500 mt-2">
            Manage public hunting and tourism packages for your Wilaya.
          </p>
        </div>
        
        <Link href="/dashboard/offers/new">
          <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold px-6 py-6 rounded-2xl gap-2 transition-all hover:scale-105 active:scale-95">
            <Plus size={20} strokeWidth={3} />
            Create New Offer
          </Button>
        </Link>
      </div>

      <OffersTable data={allOffers} />
    </div>
  )
}