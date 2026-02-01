/**
 * Drizzle Kit Configuration
 *
 * Drizzle Kit is the CLI tool that generates SQL migration files from
 * the TypeScript schema. This config tells it:
 *
 *   - schema: Where to find the table definitions (our schema.ts file)
 *   - out: Where to output generated migration SQL files (the ./drizzle folder)
 *   - dialect: Which database engine we're using (SQLite)
 *   - dbCredentials.url: Path to the SQLite database file
 *
 * Used by two commands:
 *   - `npx drizzle-kit generate` - Reads schema.ts and creates SQL migration files
 *   - `npx drizzle-kit migrate` - Runs the generated migrations against the database
 */

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',  // Path to our Drizzle table definitions
  out: './drizzle',                  // Output folder for generated migration SQL files
  dialect: 'sqlite',                // Database engine (SQLite in our case)
  dbCredentials: {
    url: 'file:./data.db',          // Path to the SQLite database file
  },
});
