// src/db/schema/offers.ts
import { pgTable, uuid, varchar, text, decimal, jsonb, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm" // 🚀 Add this import
import { stateDirectorates } from "./stateDirectorate"
import { forestDistricts } from "./forestDistricts"

export const offers = pgTable("offers", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description").notNull(),
  conditions: text("conditions"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("DZD").notNull(),
  images: jsonb("images").$type<{ url: string; key: string }[]>().default([]).notNull(),
  wilayaId: uuid("wilaya_id").references(() => stateDirectorates.id).notNull(),
  dairaId: uuid("daira_id").references(() => forestDistricts.id).notNull(),
  status: varchar("status", { length: 20 }).default("ACTIVE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  mainImage: varchar("main_image", { length: 512 }),
})

// 🚀 ADD THIS BLOCK TO FIX THE ERROR
export const offersRelations = relations(offers, ({ one }) => ({
  daira: one(forestDistricts, {
    fields: [offers.dairaId],
    references: [forestDistricts.id],
  }),
  wilaya: one(stateDirectorates, {
    fields: [offers.wilayaId],
    references: [stateDirectorates.id],
  }),
}))