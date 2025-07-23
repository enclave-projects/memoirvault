// Migration script using ES modules
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const { Client } = pg;

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../../.env.local');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config(); // Fall back to .env
}

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to database');

    console.log('Creating user_storage table...');
    await client.query(`
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
    const userIdColumnCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'media' AND column_name = 'user_id'
      );
    `);

    if (!userIdColumnCheck.rows[0].exists) {
      console.log('Adding user_id column to media table...');
      await client.query(`ALTER TABLE "media" ADD COLUMN "user_id" text;`);
      
      console.log('Updating user_id based on entries table...');
      await client.query(`
        UPDATE "media" m
        SET "user_id" = e."user_id"
        FROM "entries" e
        WHERE m."entry_id" = e."id";
      `);
      
      console.log('Making user_id NOT NULL...');
      await client.query(`ALTER TABLE "media" ALTER COLUMN "user_id" SET NOT NULL;`);
      console.log('Added and populated user_id column in media table');
    } else {
      console.log('user_id column already exists in media table');
    }

    // Check if file_path column exists in media table
    const filePathColumnCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'media' AND column_name = 'file_path'
      );
    `);

    if (!filePathColumnCheck.rows[0].exists) {
      console.log('Adding file_path column to media table...');
      await client.query(`ALTER TABLE "media" ADD COLUMN "file_path" text;`);
      
      // Check if r2_key column exists
      const r2KeyColumnCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'media' AND column_name = 'r2_key'
        );
      `);
      
      if (r2KeyColumnCheck.rows[0].exists) {
        console.log('Copying r2_key to file_path...');
        await client.query(`UPDATE "media" SET "file_path" = "r2_key";`);
      }
      
      console.log('Making file_path NOT NULL...');
      await client.query(`ALTER TABLE "media" ALTER COLUMN "file_path" SET NOT NULL;`);
      console.log('Added and populated file_path column in media table');
    } else {
      console.log('file_path column already exists in media table');
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
    process.exit(0);
  }
}

runMigration();