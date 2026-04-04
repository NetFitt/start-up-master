'use server'

import { auth, unstable_update } from "@/auth"
import { db } from "@/db"
import { users } from "@/db/schema/auth"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function connectToDirectorateAdmin(directorateId: string) {
  const session = await auth()

  // 1. Security Check: Only Mohamed (Super Admin) can do this
  if (session?.user?.role !== 'super_admin') {
    throw new Error("Unauthorized: You do not have permission to impersonate accounts.")
  }

  // 2. Find the seeded admin account for this specific Directorate
  const targetAdmin = await db.query.users.findFirst({
    where: and(
      eq(users.directorate_id, directorateId),
      eq(users.role, 'wilaya_admin')
    )
  })

  if (!targetAdmin) {
    throw new Error("Target admin account not found. Please ensure the seed was successful.")
  }

  // 3. Trigger the JWT update we wrote in auth.ts
  await unstable_update({
    action: "IMPERSONATE",
    targetId: targetAdmin.id,
    targetName: targetAdmin.name,
    targetDirectorateId: directorateId
  })

  // 4. Clear the cache so the dashboard reflects the new identity immediately
  revalidatePath('/dashboard')
  
  return { success: true }
}