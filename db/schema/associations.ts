import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core"
import { forestDistricts } from "./forestDistricts"

export const associations = pgTable("associations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(), // for cleaner URLs
  forestDistrictId: uuid("forest_district_id").references(() => forestDistricts.id).notNull(),
  
  // Permanent Contact Info
  presidentName: varchar("president_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  address: text("address").notNull(),
  
  status: varchar("status", { length: 20 }).default("ACTIVE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})