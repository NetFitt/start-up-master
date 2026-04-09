'use server'

import { auth } from "@/auth"
import { db } from "@/db"
import { offers } from "@/db/schema/offers"
import { forestDistricts } from "@/db/schema/forestDistricts"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"

/**
 * 1. Get Dairas (For the Form Dropdown)
 * Scoped to the current Wilaya Admin's directorate_id
 */
export async function getAllowedDairasForWilaya() {
  const session = await auth()
  
  if (!session?.user.directorate_id) {
    throw new Error("User does not belong to a Directorate.")
  }

  // 🚀 FIXED: Changed 'directorateId' to 'directorate_id'
  const dairas = await db.query.forestDistricts.findMany({
    where: eq(forestDistricts.directorate_id, session.user.directorate_id),
    orderBy: (district, { asc }) => [asc(district.name)],
  })

  return dairas
}

/**
 * 2. Create Offer
 */
export async function createOffer(formData: any, imageUrls: {url: string, key: string}[]) {
  try {
    const session = await auth()
    
    if (session?.user?.role !== 'wilaya_admin') {
      throw new Error("Only Wilaya Admins can create official offers.")
    }

    // 🚀 FIXED: Changed 'directorateId' to 'directorate_id' here too
    const targetDaira = await db.query.forestDistricts.findFirst({
      where: and(
        eq(forestDistricts.id, formData.dairaId),
        eq(forestDistricts.directorate_id, session.user.directorate_id!)
      )
    })

    if (!targetDaira) {
      throw new Error("Invalid Daira selected for your Wilaya territory.")
    }

    const title = formData.title
    const slug = title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    await db.insert(offers).values({
      title: title,
      slug: `${slug}-${Date.now()}`,
      description: formData.description,
      conditions: formData.conditions,
      price: formData.price.toString(),
      images: imageUrls,
      wilayaId: session.user.directorate_id!, 
      dairaId: formData.dairaId,
      status: 'ACTIVE',
    })

    revalidatePath('/dashboard/offers')
    return { success: true }

  } catch (error: any) {
    console.error("OFFER_CREATION_ERROR:", error)
    return { error: error.message }
  }
}
export async function toggleOfferStatus(id: string, currentStatus: string) {
    const session = await auth()
    if (session?.user?.role !== 'wilaya_admin') throw new Error("Unauthorized")
  
    const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'
    
    await db.update(offers)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(offers.id, id))
  
    revalidatePath('/dashboard/offers')
    return { success: true }
}

// 🔍 GET OFFER BY ID
export async function getOfferById(id: string) {
  try {
    const data = await db.query.offers.findFirst({
      where: eq(offers.id, id),
      with: {
        daira: true, // Assuming you have this relation in your schema
      }
    })
    return data
  } catch (error) {
    console.error("Error fetching offer:", error)
    return null
  }
}

// 🔄 UPDATE OFFER
export async function updateOffer(id: string, values: any, gallery: any[]) {
  try {
    // We update the main record and the gallery array
    await db.update(offers)
      .set({
        ...values,
        images: gallery, // Save the updated gallery (JSONB)
        updatedAt: new Date(),
      })
      .where(eq(offers.id, id))

    revalidatePath("/dashboard/offers")
    revalidatePath(`/dashboard/offers/${id}/edit`)
    
    return { success: true }
  } catch (error) {
    console.error("Update Error:", error)
    return { success: false, error: "Failed to update territory package." }
  }
}