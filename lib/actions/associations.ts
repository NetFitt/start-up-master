'use server'

import { db } from "@/db"
import { associations } from "@/db/schema/associations"
import { users } from "@/db/schema/auth"
import { requests } from "@/db/schema/requests"
import { forestDistricts } from "@/db/schema/forestDistricts" 
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function createAssociationFromRequest(requestId: string) {
  const request = await db.query.requests.findFirst({ 
    where: eq(requests.id, requestId) 
  })

  if (!request || !request.targetDistrictId) {
    throw new Error("Valid request or Target District not found")
  }

  const district = await db.query.forestDistricts.findFirst({
    where: eq(forestDistricts.id, request.targetDistrictId)
  })

  if (!district) throw new Error("Target Forest District not found")

  const d = request.data as any
  const pName = d.presidentName || d.president_name || d.name;
  const pEmail = d.presidentEmail || d.president_email || d.email;
  const pPhone = d.presidentPhone || d.president_phone || d.phone;

  const salt = await bcrypt.genSalt(10)
  const hashedTempPassword = await bcrypt.hash("Hunt2026!", salt) 

  return await db.transaction(async (tx) => {
    // 🚀 INSERTING ONLY KNOWN PROPERTIES
    const [newAssoc] = await tx.insert(associations).values({
      name: d.associationName || d.name || "Unnamed Association",
      slug: (d.associationName || d.name || "unnamed")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-'),
      directorate_id: district.directorate_id, 
      presidentName: pName,
      email: pEmail,
      phone: pPhone,
      address: d.address, // ✅ Now allowed because we updated the schema
    }).returning()

    await tx.insert(users).values({
      name: pName,
      email: pEmail,
      password_hash: hashedTempPassword,
      role: 'association_admin',
      association_id: newAssoc.id,
      forest_district_id: request.targetDistrictId,
      is_active: true
    })

    await tx.update(requests)
      .set({ status: 'APPROVED' })
      .where(eq(requests.id, requestId))
    
    return { success: true }
  })
}