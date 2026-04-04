'use server'

import { db } from "@/db" 
import { users } from "@/db/schema/auth"
import { eq, and, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"


export async function getAllUsers(currentUser: any) {
  // If no user or not logged in, return empty
  if (!currentUser) return [];

  // CASE 1: Super Admin (Mohamed) - Sees everyone
  if (currentUser.role === 'super_admin') {
    return await db.select().from(users).orderBy(users.name);
  }

  // CASE 2: Wilaya Admin - Only see users in their Wilaya
  // Also, exclude Super Admins so they can't even see Mohamed in the list
  if (currentUser.role === 'wilaya_admin') {
    return await db.select()
      .from(users)
      .where(
        and(
          eq(users.directorate_id, currentUser.directorate_id), // Match Wilaya
          ne(users.role, 'super_admin') // Hide the big boss
        )
      )
      .orderBy(users.name);
  }

  return [];
}
export async function upsertUser(data: any) {
  const { id, name, email, password, role } = data

  try {
    if (id) {
      // ─── UPDATE ───
      await db.update(users)
        .set({ 
          name, 
          email, 
          role,
          updated_at: new Date() // Keeping your updated_at fresh
        })
        .where(eq(users.id, id))
    } else {
      // ─── CREATE ───
      const hashedPassword = await bcrypt.hash(password, 10)
      
      await db.insert(users).values({
        name,
        email,
        password_hash: hashedPassword, // Matches your "password_hash" column
        role: role || 'user',
        // We explicitly set these to null or default to avoid the "Failed Query" 
        // if your schema doesn't have .default() set in the DB
        phone_number: null,
        is_active: true,
        directorate_id: null,
        department_id: null,
        association_id: null,
        location_id: null,
      })
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false, error: "Failed to save user." }
  }
}