// src/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as auth from '@/db/schema/auth'
import * as locations from '@/db/schema/locations'
import * as directorates from '@/db/schema/stateDirectorate'
import * as forest from '@/db/schema/forestDistricts' // Make sure this file exists!
import * as requests from '@/db/schema/requests' 
import * as associations from '@/db/schema/associations'
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Using verify-full for security as discussed earlier
  ssl: { rejectUnauthorized: false }, 
})

// Combine all exported tables and relations into one schema object
const fullSchema = {
  ...auth,
  ...locations,
  ...directorates,
  ...forest,
  ...requests,     // 👈 This makes db.query.requests work
  ...associations,
}

export const db = drizzle(pool, { schema: fullSchema })