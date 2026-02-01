/**
 * Database Schema Definitions
 *
 * This file defines the structure of all database tables using Drizzle ORM.
 * Drizzle reads these definitions to:
 *   1. Generate SQL migration files (via `drizzle-kit generate`)
 *   2. Provide TypeScript types for all queries (so you get autocomplete and type checking)
 *
 * There are three tables: beans, orders, and botd_history.
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Beans table - stores all coffee bean products.
 *
 * Each row represents a single coffee bean product with its details
 * like name, price, origin country, roast type, image URL, and description.
 *
 * The `isBOTD` column tracks whether this bean is currently the "Bean of the Day".
 * SQLite doesn't have a native boolean type, so we use integer (0 = false, 1 = true).
 */
export const beans = sqliteTable('beans', {
  id: integer('id').primaryKey({ autoIncrement: true }),   // Unique ID, auto-generated
  index: integer('index').notNull(),                       // Original index from the seed data file
  isBOTD: integer('is_botd').notNull().default(0),         // 0 = not BOTD, 1 = currently BOTD
  cost: text('cost').notNull(),                            // Price as a string, e.g. "£39.26"
  image: text('image').notNull(),                          // URL to the bean's image (Unsplash)
  colour: text('colour').notNull(),                        // Roast type, e.g. "dark roast", "green"
  name: text('name').notNull(),                            // Product name, e.g. "TURNABOUT"
  description: text('description').notNull(),              // Full text description of the bean
  country: text('country').notNull(),                      // Country of origin, e.g. "Brazil"
});

/**
 * Orders table - stores customer orders.
 *
 * Each order references a bean (via beanId foreign key) and records
 * the customer's details and the calculated total cost.
 *
 * The `createdAt` column defaults to the current timestamp using
 * SQLite's datetime('now') function, so it's automatically set on insert.
 */
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),   // Unique order ID
  beanId: integer('bean_id')                               // Which bean was ordered
    .notNull()
    .references(() => beans.id),                           // Foreign key constraint → beans table
  customerName: text('customer_name').notNull(),           // Customer's full name
  email: text('email').notNull(),                          // Customer's email address
  quantity: integer('quantity').notNull(),                  // Number of units ordered
  totalCost: text('total_cost').notNull(),                 // Calculated total, e.g. "£78.52"
  createdAt: text('created_at')                            // Timestamp of when the order was placed
    .notNull()
    .default(sql`(datetime('now'))`),                      // Auto-set to current time on insert
});

/**
 * Bean of the Day (BOTD) History table - tracks which bean was selected each day.
 *
 * This table ensures:
 *   1. The same bean is shown all day (lookup by today's date)
 *   2. A different bean is picked from yesterday (compare with yesterday's entry)
 *
 * The `date` column is unique so only one bean can be BOTD per day.
 * Dates are stored as strings in YYYY-MM-DD format.
 */
export const botdHistory = sqliteTable('botd_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),   // Unique history entry ID
  beanId: integer('bean_id')                               // Which bean was BOTD on this date
    .notNull()
    .references(() => beans.id),                           // Foreign key constraint → beans table
  date: text('date').notNull().unique(),                   // The date (YYYY-MM-DD), one entry per day
});
