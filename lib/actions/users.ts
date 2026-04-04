'use server'

import { db } from "@/db" 
import { users } from "@/db/schema/auth"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function getAllUsers() {
  return await db.select().from(users)
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
        wilaya_id: null,
        daira_id: null,
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