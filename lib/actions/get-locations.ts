'use server'
import { db } from "@/db"
import { stateDirectorates } from "@/db/schema/stateDirectorate"
import { forestDistricts } from "@/db/schema/forestDistricts"

export async function getFilterData() {
  
  const [wilayas, dairas] = await Promise.all([
    db.select().from(stateDirectorates),
    db.select().from(forestDistricts)
  ])

  console.log("TOTAL DAIRAS FETCHED:", dairas.length , dairas)
  return { wilayas, dairas }
}