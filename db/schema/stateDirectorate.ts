import { pgTable, uuid, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core'
          // 🚀 Import offers

export const stateDirectorates = pgTable('state_directorates', {
  id:          uuid('id').defaultRandom().primaryKey(),
  name:        text('name').notNull(), 
  wilaya_code: integer('wilaya_code').notNull().unique(), 
  is_active:   boolean('is_active').notNull().default(true),
  created_at:  timestamp('created_at').defaultNow(),
  updated_at:  timestamp('updated_at').defaultNow(),
})

export const stateDepartments = pgTable('state_departments', {
  id:             uuid('id').defaultRandom().primaryKey(),
  name:           text('name').notNull(),
  directorate_id: uuid('directorate_id').notNull().references(() => stateDirectorates.id, { onDelete: 'cascade' }),
  is_active:      boolean('is_active').notNull().default(true),
  created_at:     timestamp('created_at').defaultNow(),
})


