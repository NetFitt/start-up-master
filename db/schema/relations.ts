import { relations } from "drizzle-orm";
import { stateDirectorates, stateDepartments } from "./stateDirectorate";
import { associations } from "./associations";
import { offers } from "./offers";
import { users } from "./auth";
import { forestDistricts } from "./forestDistricts";

// 1. Wilaya (Directorate) Relations
export const stateDirectoratesRelations = relations(stateDirectorates, ({ many }) => ({
  departments: many(stateDepartments),
  associations: many(associations),
  offers: many(offers),
  staff: many(users),
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
  offers: many(offers),
}));