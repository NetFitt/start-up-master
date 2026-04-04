import { pgTable, uuid, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './auth'

// The Wilaya Level: State Directorate
export const stateDirectorates = pgTable('state_directorates', {
  id:           uuid('id').defaultRandom().primaryKey(),
  name:         text('name').notNull(), // e.g., "Direction de Wilaya - Batna"
  wilaya_code:  integer('wilaya_code').notNull().unique(), // The 1-58 code
  is_active:    boolean('is_active').notNull().default(true),
  created_at:   timestamp('created_at').defaultNow(),
  updated_at:   timestamp('updated_at').defaultNow(),
})

// The Daira Level: Departments
export const stateDepartments = pgTable('state_departments', {
  id:             uuid('id').defaultRandom().primaryKey(),
  name:           text('name').notNull(), // e.g., "Department of Arris"
  directorate_id: uuid('directorate_id').notNull().references(() => stateDirectorates.id, { onDelete: 'cascade' }),
  is_active:      boolean('is_active').notNull().default(true),
  created_at:     timestamp('created_at').defaultNow(),
})

// Relations
export const directorateRelations = relations(stateDirectorates, ({ many }) => ({
  departments: many(stateDepartments),
  staff:       many(users),
}))

export const departmentRelations = relations(stateDepartments, ({ one, many }) => ({
  directorate: one(stateDirectorates, {
    fields: [stateDepartments.directorate_id],
    references: [stateDirectorates.id],
  }),
  staff:       many(users),
}))