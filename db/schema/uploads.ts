import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core"
import { users } from "./auth"

export const uploads = pgTable("uploads", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  url: varchar("url", { length: 512 }).notNull(),
  key: varchar("key", { length: 255 }).notNull(), 
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), 
  size: integer("size").notNull(),
  purpose: varchar("purpose", { length: 50 }), // e.g., 'offer_image'
  createdAt: timestamp("created_at").defaultNow().notNull(),
})