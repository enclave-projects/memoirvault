import { pgTable, text, timestamp, uuid, jsonb, bigint, boolean, unique } from 'drizzle-orm/pg-core';

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

// Public profiles for sharing system
export const publicProfiles = pgTable('public_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().unique(), // Links to Clerk user
  username: text('username').notNull().unique(), // Public username
  fullName: text('full_name').notNull(),
  profilePicture: text('profile_picture'), // R2 URL for profile image
  bio: text('bio'), // Optional bio
  isJourneyPublic: boolean('is_journey_public').notNull().default(false), // All entries public toggle
  allowSpecificEntries: boolean('allow_specific_entries').notNull().default(true), // Allow individual entry control
  followersCount: bigint('followers_count', { mode: 'number' }).notNull().default(0),
  followingCount: bigint('following_count', { mode: 'number' }).notNull().default(0),
  publicEntriesCount: bigint('public_entries_count', { mode: 'number' }).notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User follows system
export const userFollows = pgTable('user_follows', {
  id: uuid('id').defaultRandom().primaryKey(),
  followerUserId: text('follower_user_id').notNull(), // User who follows
  followingUserId: text('following_user_id').notNull(), // User being followed
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Ensure unique follow relationships
  uniqueFollow: unique().on(table.followerUserId, table.followingUserId),
}));

// Public entry visibility control
export const publicEntryVisibility = pgTable('public_entry_visibility', {
  id: uuid('id').defaultRandom().primaryKey(),
  entryId: uuid('entry_id').references(() => entries.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').notNull(),
  isPublic: boolean('is_public').notNull().default(false),
  madePublicAt: timestamp('made_public_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Ensure unique entry visibility records
  uniqueEntryUser: unique().on(table.entryId, table.userId),
}));

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type UserStorage = typeof userStorage.$inferSelect;
export type NewUserStorage = typeof userStorage.$inferInsert;
export type PublicProfile = typeof publicProfiles.$inferSelect;
export type NewPublicProfile = typeof publicProfiles.$inferInsert;
export type UserFollow = typeof userFollows.$inferSelect;
export type NewUserFollow = typeof userFollows.$inferInsert;
export type PublicEntryVisibility = typeof publicEntryVisibility.$inferSelect;
export type NewPublicEntryVisibility = typeof publicEntryVisibility.$inferInsert;