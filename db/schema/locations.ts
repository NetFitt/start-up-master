import { pgTable, integer, varchar } from 'drizzle-orm/pg-core'
 
export const algeriaCities = pgTable('algeria_cities', {
    id:                integer('id').primaryKey(),
    commune_name:      varchar('commune_name',      { length: 255 }).notNull(),
    commune_name_ascii: varchar('commune_name_ascii', { length: 255 }).notNull(),
    daira_name:        varchar('daira_name',        { length: 255 }).notNull(),
    daira_name_ascii:  varchar('daira_name_ascii',  { length: 255 }).notNull(),
    wilaya_code:          varchar('wilaya_code', { length: 10 }).notNull(),
    wilaya_name:       varchar('wilaya_name',       { length: 255 }).notNull(),
    wilaya_name_ascii: varchar('wilaya_name_ascii', { length: 255 }).notNull(),
})
 