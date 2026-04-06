import { auth } from "@/auth"
import { db } from "@/db"
import { algeriaCities } from "@/db/schema/locations"
import { stateDirectorates } from "@/db/schema/stateDirectorate"
import { forestDistricts } from "@/db/schema/forestDistricts"
import { eq, and, notInArray } from "drizzle-orm"
import { redirect } from "next/navigation"
import CreateDistrictModal from "@/components/dashboard/CreateDistrictModal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building, MapPin, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import ConnectDistrictButton from "@/components/dashboard/ConnectDistrictButton"

export default async function ForestDistrictsPage() {
  const session = await auth()
  console.log("Current Session User:", session?.user);
  if (!session?.user.directorate_id) redirect('/dashboard')

  // 1. Get the official numeric Wilaya Code (e.g., 1 or 49) from your Directorate UUID
  const directorate = await db.query.stateDirectorates.findFirst({
    where: eq(stateDirectorates.id, session.user.directorate_id)
  })

  if (!directorate) return <div>Directorate record missing.</div>

  // 2. Get existing District offices for this Wilaya
  const existingDistricts = await db.query.forestDistricts.findMany({
    where: eq(forestDistricts.directorate_id, directorate.id),
    with: { city: true, staff: true } // Assuming relations are set up
  })

  const takenCityIds = existingDistricts.map(d => d.location_id)

  // 3. Get Baladias for THIS Wilaya only (padding the code to match "01", "06", etc.)
  const availableCities = await db.select()
    .from(algeriaCities)
    .where(
      and(
        eq(algeriaCities.wilaya_code, String(directorate.wilaya_code).padStart(2, '0')),
        takenCityIds.length > 0 ? notInArray(algeriaCities.id, takenCityIds) : undefined
      )
    )

  return (
    <div className="space-y-10 p-8">
      <div className="flex justify-between items-start gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">Forest Districts</h1>
          <p className="text-slate-500 mt-2">Manage administrative offices for {directorate.name}</p>
        </div>
        <CreateDistrictModal 
          availableCities={availableCities} 
          directorateId={directorate.id} 
        />
      </div>

      <div className="border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-black/20 backdrop-blur-xl overflow-hidden">
        <div className="max-h-[calc(100vh-300px)] overflow-auto custom-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 z-20 bg-slate-50 dark:bg-[#0a0a0a]">
              <TableRow>
                <TableHead className="pl-8 py-5">Office Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Staff Count</TableHead>
                <TableHead className="text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {existingDistricts.map((dist) => (
                <TableRow key={dist.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                  <TableCell className="pl-8 py-6 font-medium text-lg">
                    {dist.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin size={14} className="text-[#22c55e]" />
                      {(dist as any).city?.commune_name_ascii}
                    </div>
                  </TableCell>
                  <TableCell>
                    {(dist as any).staff?.length || 0} Members
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <ConnectDistrictButton
                      districtId={dist.id} 
                      districtName={dist.name} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}