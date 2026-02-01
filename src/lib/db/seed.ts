/**
 * Database Seed Script
 *
 * Run with: `npm run seed`
 *
 * This script reads the coffee bean data from AllTheBeans.json (the seed data file)
 * and inserts it into the SQLite database. It clears any existing beans first,
 * so it's safe to run multiple times.
 *
 * The seed data has slightly different field names (e.g. "Cost" vs "cost",
 * "Name" vs "name") so we map them during insertion.
 */

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { beans } from './schema';
import path from 'path';
import fs from 'fs';

/**
 * Type definition for each bean object in AllTheBeans.json.
 * Note: the JSON uses PascalCase/camelCase field names (e.g. "Cost", "Name")
 * which differ from our database schema's lowercase column names.
 */
interface SeedBean {
  _id: string;         // Original MongoDB-style ID (not used in our SQLite schema)
  index: number;       // Display order index
  isBOTD: boolean;     // Whether this bean was originally marked as BOTD
  Cost: string;        // Price string, e.g. "£39.26"
  Image: string;       // Unsplash image URL
  colour: string;      // Roast type
  Name: string;        // Bean product name
  Description: string; // Full description text
  Country: string;     // Country of origin
}

// Create a separate database connection for the seed script
// (this runs as a standalone script, not inside Next.js)
const dbPath = path.join(process.cwd(), 'data.db');
const client = createClient({ url: `file:${dbPath}` });
const db = drizzle(client);

async function seed() {
  // Read the seed data JSON file from the project root
  const seedDataPath = path.join(process.cwd(), 'AllTheBeans.json');
  const seedData: SeedBean[] = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

  // Delete all existing beans so we start fresh
  await db.delete(beans);

  // Insert each bean, mapping the JSON field names to our schema's column names
  for (const bean of seedData) {
    await db.insert(beans).values({
      index: bean.index,
      isBOTD: bean.isBOTD ? 1 : 0,   // Convert boolean to SQLite integer (0/1)
      cost: bean.Cost,                 // "Cost" → "cost"
      image: bean.Image,               // "Image" → "image"
      colour: bean.colour,             // Same name, no mapping needed
      name: bean.Name,                 // "Name" → "name"
      description: bean.Description.trim(), // Trim trailing whitespace from descriptions
      country: bean.Country,           // "Country" → "country"
    });
  }

  console.log(`Seeded ${seedData.length} beans successfully`);
}

// Run the seed function and log any errors
seed().catch(console.error);
