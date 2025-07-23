// Migration script to fix storage column types
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

async function fixStorageTypes() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to database');

    // Drop the existing user_storage table if it exists
    console.log('Dropping existing user_storage table...');
    await client.query(`DROP TABLE IF EXISTS "user_storage";`);

    // Create the user_storage table with correct bigint types
    console.log('Creating user_storage table with bigint types...');
    await client.query(`
      CREATE TABLE "user_storage" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" text NOT NULL,
        "plan" text DEFAULT 'free' NOT NULL,
        "storage_limit" bigint DEFAULT 2147483648 NOT NULL,
        "storage_used" bigint DEFAULT 0 NOT NULL,
        "last_updated" timestamp DEFAULT now() NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "user_storage_user_id_unique" UNIQUE("user_id")
      );
    `);
    console.log('Created user_storage table with bigint types');

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
    process.exit(0);
  }
}

fixStorageTypes();