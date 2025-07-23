import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function runMigration() {
  try {
    console.log('Starting database migration...');

    // Create user_storage table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "user_storage" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" text NOT NULL,
        "plan" text DEFAULT 'free' NOT NULL,
        "storage_limit" integer DEFAULT 2147483648 NOT NULL,
        "storage_used" integer DEFAULT 0 NOT NULL,
        "last_updated" timestamp DEFAULT now() NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "user_storage_user_id_unique" UNIQUE("user_id")
      );
    `);
    console.log('Created user_storage table');

    // Check if user_id column exists in media table
    const userIdColumnExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'media' AND column_name = 'user_id'
      );
    `);

    if (!userIdColumnExists.rows[0].exists) {
      // Add user_id column
      await db.execute(sql`ALTER TABLE "media" ADD COLUMN "user_id" text;`);
      
      // Update user_id based on entries table
      await db.execute(sql`
        UPDATE "media" m
        SET "user_id" = e."user_id"
        FROM "entries" e
        WHERE m."entry_id" = e."id";
      `);
      
      // Make user_id NOT NULL
      await db.execute(sql`ALTER TABLE "media" ALTER COLUMN "user_id" SET NOT NULL;`);
      console.log('Added and populated user_id column in media table');
    }

    // Check if file_path column exists in media table
    const filePathColumnExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'media' AND column_name = 'file_path'
      );
    `);

    if (!filePathColumnExists.rows[0].exists) {
      // Add file_path column
      await db.execute(sql`ALTER TABLE "media" ADD COLUMN "file_path" text;`);
      
      // Check if r2_key column exists
      const r2KeyColumnExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'media' AND column_name = 'r2_key'
        );
      `);
      
      if (r2KeyColumnExists.rows[0].exists) {
        // Copy r2_key to file_path
        await db.execute(sql`UPDATE "media" SET "file_path" = "r2_key";`);
      }
      
      // Make file_path NOT NULL
      await db.execute(sql`ALTER TABLE "media" ALTER COLUMN "file_path" SET NOT NULL;`);
      console.log('Added and populated file_path column in media table');
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

runMigration();