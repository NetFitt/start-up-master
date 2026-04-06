'use server'

import { auth, unstable_update } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema/auth"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/**
 * 1. SUPER ADMIN -> WILAYA ADMIN
 * Triggered by Mohamed to manage a specific State Directorate
 */
export async function connectToDirectorateAdmin(directorateId: string) {
  const session = await auth()

  // Security Check: Only the Super Admin can jump to a Wilaya level
  if (session?.user?.role !== 'super_admin') {
    throw new Error("Unauthorized: Only Super Admin can impersonate a Directorate.")
  }

  // Find the seeded 'wilaya_admin' for this Directorate
  const targetAdmin = await db.query.users.findFirst({
    where: and(
      eq(users.directorate_id, directorateId),
      eq(users.role, 'wilaya_admin')
    )
  })

  if (!targetAdmin) {
    throw new Error("Target Wilaya Admin account not found.")
  }

  // Update JWT with Wilaya context
  await unstable_update({
    action: "IMPERSONATE",
    targetId: targetAdmin.id,
    targetName: targetAdmin.name,
    targetRole: 'wilaya_admin',
    targetDirectorateId: directorateId,
    targetForestDistrictId: null, // Ensure district is cleared when jumping to Wilaya
    targetLocationId: targetAdmin.location_id
  } as any)

  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * 2. WILAYA/SUPER -> BALADIA ADMIN
 * Triggered to manage a specific Forest District office
 */
export async function connectToDistrictAdmin(districtId: string) {
  const session = await auth()
  
  const isSuper = session?.user?.role === 'super_admin'
  const isWilaya = session?.user?.role === 'wilaya_admin'

  if (!isSuper && !isWilaya) {
    throw new Error("Unauthorized: Insufficient permissions to manage this district.")
  }

  // Find the 'baladia_admin' for this specific Forest District
  const targetAdmin = await db.query.users.findFirst({
    where: and(
      eq(users.forest_district_id, districtId),
      eq(users.role, 'baladia_admin')
    )
  })

  if (!targetAdmin) {
    throw new Error("No administrator found for this Forest District.")
  }

  // Security: If current user is a Wilaya Admin, ensure this district is in THEIR Wilaya
  if (isWilaya && targetAdmin.directorate_id !== session.user.directorate_id) {
    throw new Error("Unauthorized: This district does not belong to your Directorate.")
  }

  // Update JWT with District (Baladia) context
  await unstable_update({
    action: "IMPERSONATE",
    targetId: targetAdmin.id,
    targetName: targetAdmin.name,
    targetRole: 'baladia_admin',
    targetDirectorateId: targetAdmin.directorate_id,
    targetForestDistrictId: districtId,
    targetLocationId: targetAdmin.location_id
  } as any)

  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * 3. UNIVERSAL EXIT
 * Returns the user to their "True Identity" (Super Admin or Wilaya Admin)
 */
export async function restoreAccess() {
  await unstable_update({
    action: "EXIT" 
  } as any)

  revalidatePath('/dashboard')
  return { success: true }
}