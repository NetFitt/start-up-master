import { relations } from "drizzle-orm";
import { stateDirectorates, stateDepartments } from "./stateDirectorate";
import { associations } from "./associations";
import { offers } from "./offers";
import { users } from "./auth";
import { forestDistricts } from "./forestDistricts";
import { algeriaCities } from "./locations"; // 🚀 1. MUST import the locations table

// 1. Wilaya (Directorate) Relations
export const stateDirectoratesRelations = relations(stateDirectorates, ({ many }) => ({
  departments: many(stateDepartments),
  associations: many(associations),
  offers: many(offers),
  // 🚀 Added name to distinguish directorate staff from district staff
  staff: many(users, { relationName: "directorate_staff" }), 
  districts: many(forestDistricts),
}));

// 2. Association Relations
export const associationsRelations = relations(associations, ({ one }) => ({
  wilaya: one(stateDirectorates, {
    fields: [associations.directorate_id],
    references: [stateDirectorates.id],
  }),
}));

// 3. Offer Relations
export const offersRelations = relations(offers, ({ one }) => ({
  wilaya: one(stateDirectorates, {
    fields: [offers.wilayaId],
    references: [stateDirectorates.id],
  }),
  daira: one(forestDistricts, {
    fields: [offers.dairaId],
    references: [forestDistricts.id],
  }),
}));

// 4. District/Daira Relations
export const forestDistrictsRelations = relations(forestDistricts, ({ one, many }) => ({
  directorate: one(stateDirectorates, {
    fields: [forestDistricts.directorate_id],
    references: [stateDirectorates.id],
  }),
  city: one(algeriaCities, {
    fields: [forestDistricts.location_id],
    references: [algeriaCities.id],
  }),
  // 🚀 Added relationName: "district_staff"
  staff: many(users, { relationName: "district_staff" }), 
  offers: many(offers),
}));

// 5. User Relations (To make the 'staff' link work backwards)
export const usersRelations = relations(users, ({ one }) => ({
  // 🚀 Added relationName: "district_staff" here too
  district: one(forestDistricts, {
    fields: [users.forest_district_id],
    references: [forestDistricts.id],
    relationName: "district_staff", 
  }),
  // 🚀 Added relationName: "directorate_staff" here too
  directorate: one(stateDirectorates, {
    fields: [users.directorate_id],
    references: [stateDirectorates.id],
    relationName: "directorate_staff",
  }),
}));