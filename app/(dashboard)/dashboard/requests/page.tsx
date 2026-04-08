import { auth } from "@/auth"
import { db } from "@/db"
import { requests } from "@/db/schema/requests"
import { eq, and, desc } from "drizzle-orm"
import { redirect } from "next/navigation"
import RequestsTable from "./requests-table"

export default async function DairaRequestsPage() {
  const session = await auth()
  
  // Security: Only Daira (Baladia) admins or higher
  if (!['super_admin', 'wilaya_admin', 'baladia_admin'].includes(session?.user?.role!)) {
    redirect('/dashboard')
  }

  // Fetch requests filtered by the admin's district
  // If Super Admin, show all. If Daira Admin, show only theirs.
  const districtId = session?.user.forest_district_id

  const allRequests = await db.query.requests.findMany({
    where: districtId ? eq(requests.targetDistrictId, districtId) : undefined,
    orderBy: [desc(requests.createdAt)],
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-white">Application Inbox</h1>
        <p className="text-gray-500 mt-2">Manage incoming association registration requests for your district.</p>
      </div>

      <RequestsTable data={allRequests} />
    </div>
  )
}