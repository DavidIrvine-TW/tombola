/**
 * Database Connection Module
 *
 * Creates and exports a single shared database connection for the entire app.
 * Uses @libsql/client as the SQLite driver (a pure JavaScript implementation
 * that doesn't require native compilation, unlike better-sqlite3).
 *
 * The database file is stored at the project root as `data.db`.
 * This file is created automatically when you run migrations.
 */

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import path from 'path';

// Construct the absolute path to the database file in the project root
const dbPath = path.join(process.cwd(), 'data.db');

// Create a libsql client pointing to the local SQLite file
// The `file:` prefix tells libsql to use a local file (not a remote server)
const client = createClient({
  url: `file:${dbPath}`,
});

/**
 * The Drizzle ORM instance, configured with our schema.
 *
 * Passing the schema allows Drizzle to provide full TypeScript
 * type inference on all queries - so `db.select().from(beans)`
 * automatically knows the shape of a bean row.
 *
 * This single `db` instance is imported by all API routes and services.
 */
export const db = drizzle(client, { schema });
