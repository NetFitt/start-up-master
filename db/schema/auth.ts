import { pgTable, uuid, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core'
import { forestDistricts } from './forestDistricts' // Adjust path if needed
import { relations } from 'drizzle-orm'

export const roleEnum = pgEnum('role', [
  'super_admin', 
  'wilaya_admin', 
  'baladia_admin', // Ensure this is here!
  'department_admin', 
  'association_president', 
  "association_admin",
  'hunter'
])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  role: roleEnum('role').default('hunter'),
  
  // 🚀 THIS FIXES THE "DOES NOT EXIST" ERROR 🚀
  forest_district_id: uuid('forest_district_id').references(() => forestDistricts.id),
  phone_number: text('phone_number'),
  department_id: uuid('department_id'),
  association_id: uuid('association_id'),
  location_id: integer('location_id'), 
  directorate_id: uuid('directorate_id'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})



export const userRelations = relations(users, ({ one }) => ({
  // Define the relationship back to the Forest District office
  forestDistrict: one(forestDistricts, {
    fields: [users.forest_district_id],
    references: [forestDistricts.id],
  }),
}))