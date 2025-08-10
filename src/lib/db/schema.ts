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
// Community posts system
export const communityPosts = pgTable('community_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'), // Optional image/video link
  videoUrl: text('video_url'), // Optional video link
  authorName: text('author_name').notNull(),
  authorEmail: text('author_email'), // Optional for existing users
  isExistingUser: boolean('is_existing_user').notNull().default(false),
  userId: text('user_id'), // Only for existing users
  isApproved: boolean('is_approved').notNull().default(true), // Auto-approve for now
  likesCount: bigint('likes_count', { mode: 'number' }).notNull().default(0),
  repliesCount: bigint('replies_count', { mode: 'number' }).notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Contact messages from users
export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  userId: text('user_id'), // Optional - if user is logged in
  subject: text('subject').notNull().default('General Inquiry'),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'), // 'new', 'read', 'replied', 'closed'
  adminNotes: text('admin_notes'), // Internal notes for admin
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Site status management
export const siteStatus = pgTable('site_status', {
  id: uuid('id').defaultRandom().primaryKey(),
  serviceName: text('service_name').notNull(), // 'website', 'api', 'database', 'storage', etc.
  status: text('status').notNull().default('operational'), // 'operational', 'degraded', 'partial_outage', 'major_outage', 'maintenance'
  description: text('description'), // Status description
  lastChecked: timestamp('last_checked').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Ensure unique service names
  uniqueService: unique().on(table.serviceName),
}));

// Help center articles
export const helpArticles = pgTable('help_articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category').notNull().default('general'), // 'general', 'account', 'privacy', 'technical', etc.
  tags: text('tags').array(), // Searchable tags
  isPublished: boolean('is_published').notNull().default(true),
  viewCount: bigint('view_count', { mode: 'number' }).notNull().default(0),
  helpfulCount: bigint('helpful_count', { mode: 'number' }).notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type UserFollow = typeof userFollows.$inferSelect;
export type NewUserFollow = typeof userFollows.$inferInsert;
export type PublicEntryVisibility = typeof publicEntryVisibility.$inferSelect;
export type NewPublicEntryVisibility = typeof publicEntryVisibility.$inferInsert;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type NewCommunityPost = typeof communityPosts.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
export type SiteStatus = typeof siteStatus.$inferSelect;
export type NewSiteStatus = typeof siteStatus.$inferInsert;
export type HelpArticle = typeof helpArticles.$inferSelect;
export type NewHelpArticle = typeof helpArticles.$inferInsert;