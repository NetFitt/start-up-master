// src/lib/actions/associations.ts
'use server'

import { db } from "@/db"
import { associations } from "@/db/schema/associations"
import { users } from "@/db/schema/auth"
import { requests } from "@/db/schema/requests"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function createAssociationFromRequest(requestId: string) {
    const request = await db.query.requests.findFirst({ 
      where: eq(requests.id, requestId) 
    })
  
    if (!request) throw new Error("Request not found")
  
    const d = request.data as any
    
    // 🚀 DEBUG: This will show you exactly what keys exist in your terminal
    console.log("Current Request Data:", d)
  
    // 1. Defend against missing data (CamelCase vs Snake_case check)
    const pName = d.presidentName || d.president_name || d.name;
    const pEmail = d.presidentEmail || d.president_email || d.email;
    const pPhone = d.presidentPhone || d.president_phone || d.phone;
  
    const salt = await bcrypt.genSalt(10)
    const hashedTempPassword = await bcrypt.hash("Hunt2026!", salt) 
  
    return await db.transaction(async (tx) => {
      // 2. Create the Association
      const [newAssoc] = await tx.insert(associations).values({
        name: d.associationName || d.name || "Unnamed Association",
        slug: (d.associationName || d.name || "unnamed").toLowerCase().trim().replace(/\s+/g, '-'),
        forestDistrictId: request.targetDistrictId,
        presidentName: pName,
        email: pEmail,
        phone: pPhone,
        address: d.address,
      }).returning()
  
      // 3. Create the Admin User
      await tx.insert(users).values({
        name: pName,
        email: pEmail,
        password_hash: hashedTempPassword,
        role: 'association_admin',
        association_id: newAssoc.id,
        forest_district_id: request.targetDistrictId,
        is_active: true
      })
  
      // 4. Update the Request Status
      await tx.update(requests)
        .set({ status: 'APPROVED' })
        .where(eq(requests.id, requestId))
      
      return { success: true }
    })
  } 