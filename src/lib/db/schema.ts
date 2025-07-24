import { pgTable, text, timestamp, uuid, jsonb, bigint } from 'drizzle-orm/pg-core';

export const entries = pgTable('entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const media = pgTable('media', {
  id: uuid('id').defaultRandom().primaryKey(),
  entryId: uuid('entry_id').references(() => entries.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').notNull(), // Add userId for easier querying
  fileName: text('file_name').notNull(),
  originalName: text('original_name').notNull(),
  fileType: text('file_type').notNull(), // 'image', 'video', 'audio'
  mimeType: text('mime_type').notNull(),
  fileSize: bigint('file_size', { mode: 'number' }).notNull(),
  filePath: text('file_path').notNull(), // Path in storage (was r2Key)
  publicUrl: text('public_url').notNull(),
  metadata: jsonb('metadata'), // Additional metadata like dimensions, duration, etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userStorage = pgTable('user_storage', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().unique(),
  plan: text('plan').notNull().default('free'), // 'free', 'basic', 'pro'
  storageLimit: bigint('storage_limit', { mode: 'number' }).notNull().default(2147483648), // 2GB in bytes
  storageUsed: bigint('storage_used', { mode: 'number' }).notNull().default(0), // bytes used
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type UserStorage = typeof userStorage.$inferSelect;
export type NewUserStorage = typeof userStorage.$inferInsert;