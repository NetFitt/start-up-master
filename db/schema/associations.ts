import { pgTable, uuid, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { stateDirectorates } from "./stateDirectorate"

export const associations = pgTable("associations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  
  directorate_id: uuid("directorate_id")
    .notNull()
    .references(() => stateDirectorates.id, { onDelete: 'cascade' }),

  presidentName: text("president_name"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  
  // 🚀 ADD THIS LINE TO FIX THE ERROR
  address: text("address"), 

  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
})