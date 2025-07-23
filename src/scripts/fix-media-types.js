// Migration script to fix media file_size column type
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

async function fixMediaTypes() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to database');

    // Check if file_size column exists and its type
    const columnInfo = await client.query(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'media' AND column_name = 'file_size';
    `);

    if (columnInfo.rows.length > 0) {
      console.log(`Current file_size column type: ${columnInfo.rows[0].data_type}`);
      
      if (columnInfo.rows[0].data_type === 'integer') {
        console.log('Converting file_size column from integer to bigint...');
        await client.query(`ALTER TABLE "media" ALTER COLUMN "file_size" TYPE bigint;`);
        console.log('Successfully converted file_size column to bigint');
      } else {
        console.log('file_size column is already bigint');
      }
    } else {
      console.log('file_size column not found');
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

fixMediaTypes();