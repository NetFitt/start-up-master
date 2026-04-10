'use server'

import { db } from "@/db"
import { offers } from "@/db/schema/offers"
import { eq, and, gte, lte } from "drizzle-orm"

export async function getPublicOffers(filters: {
  wilayaId?: string,
  dairaId?: string,
  minPrice?: number,
  maxPrice?: number,
}) {
  const conditions = []
  
  // 📍 Location Filters
  if (filters.wilayaId && filters.wilayaId !== 'all') {
    conditions.push(eq(offers.wilayaId, filters.wilayaId))
  }
  if (filters.dairaId && filters.dairaId !== 'all') {
    conditions.push(eq(offers.dairaId, filters.dairaId))
  }

  // 💰 Price Filters (Handling the PgNumeric string conversion)
  if (filters.minPrice !== undefined) {
    conditions.push(gte(offers.price, filters.minPrice.toString()))
  }
  
  if (filters.maxPrice !== undefined) {
    conditions.push(lte(offers.price, filters.maxPrice.toString()))
  }

  // 🚀 Fetching everything
  const results = await db.query.offers.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: { 
      // These keys MUST match the names in your offersRelations (src/db/schema/offers.ts)
      daira: true, 
      wilaya: true 
    },
    orderBy: (offers, { desc }) => [desc(offers.createdAt)]
  })

  return results
}