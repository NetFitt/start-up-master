import { auth } from "@/auth"
import { db } from "@/db"
import { associations } from "@/db/schema/associations"
import { eq, desc } from "drizzle-orm"
import { redirect } from "next/navigation"
import AssociationsTable from "./associations-table"

export default async function AssociationsPage() {
  const session = await auth()
  
  // Security: Only Daira admins and above
  if (!['super_admin', 'wilaya_admin', 'baladia_admin'].includes(session?.user?.role!)) {
    redirect('/dashboard')
  }

  const districtId = session?.user.forest_district_id

  // Fetch associations for this district
  const districtAssociations = await db.query.associations.findMany({
    where: districtId ? eq(associations.forestDistrictId, districtId) : undefined,
    orderBy: [desc(associations.createdAt)],
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Registered Associations</h1>
          <p className="text-gray-500 mt-2">Official hunting clubs operating under your jurisdiction.</p>
        </div>
      </div>

      <AssociationsTable data={districtAssociations} />
    </div>
  )
}