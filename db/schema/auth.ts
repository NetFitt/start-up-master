import {
  pgTable, uuid, text, timestamp, boolean, pgEnum, integer
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { stateDirectorates, stateDepartments } from './stateDirectorate'

export const roleEnum = pgEnum('role', [
  'super_admin',
  'wilaya_admin',    // Admin of a State Directorate
  'department_admin', // Admin of a specific Department
  'association_president',
  'hunter',
])

export const users = pgTable('users', {
  id:             uuid('id').defaultRandom().primaryKey(),
  name:           text('name').notNull(),
  email:          text('email').notNull().unique(),
  password_hash:  text('password_hash').notNull(),
  role:           roleEnum('role').notNull().default('hunter'),
  phone_number:   text('phone_number'),
  is_active:      boolean('is_active').notNull().default(true),

  // Authority Links
  directorate_id: uuid('directorate_id').references(() => stateDirectorates.id),
  department_id:  uuid('department_id').references(() => stateDepartments.id),
  
  association_id: uuid('association_id'), // Linked to association table later
  location_id:    integer('location_id'), // Refers to algeria_cities ID (Commune)

  created_at:     timestamp('created_at').defaultNow(),
  updated_at:     timestamp('updated_at').defaultNow(),
})

// Auth.js Tables (Sessions/Tokens)
export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId:       uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires:      timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token:      text('token').notNull(),
  expires:    timestamp('expires', { mode: 'date' }).notNull(),
})

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  directorate: one(stateDirectorates, {
    fields: [users.directorate_id],
    references: [stateDirectorates.id],
  }),
  department: one(stateDepartments, {
    fields: [users.department_id],
    references: [stateDepartments.id],
  }),
}))