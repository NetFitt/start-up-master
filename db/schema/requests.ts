import { pgTable, uuid, varchar, text, timestamp, jsonb } from "drizzle-orm/pg-core"
import { users } from "./auth"
import { forestDistricts } from "./forestDistricts"
import { relations } from "drizzle-orm"

// src/db/schema/requests.ts
export const requests = pgTable("requests", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    targetDistrictId: uuid("target_district_id").notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    status: varchar("status", { length: 20 }).default("PENDING").notNull(),
  
    // 🚀 ONLY "data" should have these keys. 
    // DO NOT define "presidentName" as a separate column here!
    data: jsonb("data").$type<{
      name: string;
      description: string;
      address: string;
      presidentName: string;   
      presidentEmail: string;  
      presidentPhone: string;  
      presidentNIN: string;    
    }>().notNull(),
  
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
// Relations for easier querying
export const requestsRelations = relations(requests, ({ one }) => ({
  user: one(users, { fields: [requests.userId], references: [users.id] }),
  district: one(forestDistricts, { fields: [requests.targetDistrictId], references: [forestDistricts.id] }),
}))