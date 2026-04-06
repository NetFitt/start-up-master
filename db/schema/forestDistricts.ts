// src/db/schema/forestDistricts.ts
import { pgTable, uuid, text, timestamp, boolean, integer, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { stateDirectorates } from './stateDirectorate'
import { algeriaCities } from './locations'
import { users } from './auth'

export const forestDistricts = pgTable('forest_districts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), // e.g., "Circonscription des Forêts de Baghlia"
  
  // Hierarchy: Strictly linked to the Wilaya level
  directorate_id: uuid('directorate_id')
    .notNull()
    .references(() => stateDirectorates.id, { onDelete: 'cascade' }),

  // Location: Linked to the unique ID in algeria_cities
  location_id: integer('location_id')
    .notNull()
    .references(() => algeriaCities.id),

  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => ({
  // Constraint: One Forest District per Baladia (Commune)
  uniqueBaladia: uniqueIndex('idx_unique_baladia').on(table.location_id),
}))

// --- RELATIONS ---
export const forestDistrictRelations = relations(forestDistricts, ({ one, many }) => ({
// The Parent Wilaya
    staff: many(users),
    directorate: one(stateDirectorates, {
    fields: [forestDistricts.directorate_id],
    references: [stateDirectorates.id],
    }),

    // Link to the City details
    city: one(algeriaCities, {
        fields: [forestDistricts.location_id],
        references: [algeriaCities.id],
    }),
}))