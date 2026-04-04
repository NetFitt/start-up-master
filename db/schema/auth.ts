// src/db/schema/auth.ts
import {
    pgTable, uuid, text, timestamp, boolean, pgEnum, integer
  } from 'drizzle-orm/pg-core'
  
  export const roleEnum = pgEnum('role', [
    'super_admin',
    'wilaya_admin',
    'daira_admin',
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
  
    // filled depending on role — null for super_admin
    wilaya_id:      uuid('wilaya_id'),
    daira_id:       uuid('daira_id'),
    association_id: uuid('association_id'),
    location_id:    integer('location_id'), // baladia ref for hunters
  
    created_at:     timestamp('created_at').defaultNow(),
    updated_at:     timestamp('updated_at').defaultNow(),
  })
  
  // Auth.js requires these three
  export const sessions = pgTable('sessions', {
    sessionToken:  text('session_token').primaryKey(),
    userId:        uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    expires:       timestamp('expires', { mode: 'date' }).notNull(),
  })
  
  export const verificationTokens = pgTable('verification_tokens', {
    identifier:  text('identifier').notNull(),
    token:       text('token').notNull(),
    expires:     timestamp('expires', { mode: 'date' }).notNull(),
  })