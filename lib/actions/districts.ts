'use server'

import { db } from "@/db"
import { users } from "@/db/schema/auth"
import { forestDistricts } from "@/db/schema/forestDistricts"
import { algeriaCities } from "@/db/schema/locations"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function createDistrictAdmin(data: {
  name: string,
  email: string,
  location_id: number,
  directorate_id: string
}) {
  try {
    return await db.transaction(async (tx) => {
      // 1. Double check city/district existence
      const city = await tx.query.algeriaCities.findFirst({ where: eq(algeriaCities.id, data.location_id) });
      const existingDist = await tx.query.forestDistricts.findFirst({ where: eq(forestDistricts.location_id, data.location_id) });
      
      if (existingDist) return { error: "Office already exists for this Baladia." };
      if (!city) return { error: "City not found." };

      // 2. Create the Office Record
      const [newOffice] = await tx.insert(forestDistricts).values({
        name: `Circonscription des Forêts de ${city.commune_name_ascii}`,
        directorate_id: data.directorate_id,
        location_id: data.location_id,
      }).returning();

      // 3. Create the Admin User Record
      const hashedPassword = await bcrypt.hash("YouHunt2026!", 10);
      await tx.insert(users).values({
        name: data.name,
        email: data.email,
        password_hash: hashedPassword,
        role: 'baladia_admin',
        directorate_id: data.directorate_id,
        forest_district_id: newOffice.id, // Linking to office
        location_id: data.location_id,
        is_active: true,
      });

      revalidatePath('/dashboard/forest-districts');
      return { success: true };
    });
  } catch (e) {
    return { error: "Critical database failure." };
  }
}