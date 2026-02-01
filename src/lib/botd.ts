/**
 * Bean of the Day (BOTD) Service
 *
 * This module handles the logic for selecting and returning the daily featured bean.
 *
 * How it works:
 *   1. Check if a bean has already been selected for today (stored in botd_history table)
 *   2. If yes, return that same bean (so the BOTD stays consistent throughout the day)
 *   3. If no, pick a new random bean that's different from yesterday's BOTD
 *   4. Record the selection in botd_history so subsequent requests today return the same bean
 *   5. Update the isBOTD flag on the beans table so only the selected bean is marked as BOTD
 */

import { db } from './db';
import { beans, botdHistory } from './db/schema';
import { eq, ne } from 'drizzle-orm';

/**
 * Returns today's date as a YYYY-MM-DD string.
 * This format is used as the key in the botd_history table.
 */
function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns yesterday's date as a YYYY-MM-DD string.
 * Used to look up yesterday's BOTD so we can exclude it from today's selection.
 */
function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

/**
 * Gets the Bean of the Day.
 *
 * This is the main function called by the /api/botd route handler.
 * It either returns an existing BOTD for today, or selects a new one.
 *
 * @returns The selected bean object, or null if no beans exist in the database
 */
export async function getBeanOfTheDay() {
  const today = getToday();

  // --- Step 1: Check if we've already picked a BOTD for today ---
  // Look for a botd_history entry with today's date
  const [existing] = await db
    .select()
    .from(botdHistory)
    .where(eq(botdHistory.date, today))
    .limit(1);

  // If we found one, fetch and return the corresponding bean
  if (existing) {
    const [bean] = await db
      .select()
      .from(beans)
      .where(eq(beans.id, existing.beanId))
      .limit(1);
    return bean ?? null;
  }

  // --- Step 2: No BOTD for today yet, so we need to select one ---

  // Look up yesterday's BOTD so we can exclude it (to ensure variety)
  const yesterday = getYesterday();
  const [yesterdayEntry] = await db
    .select()
    .from(botdHistory)
    .where(eq(botdHistory.date, yesterday))
    .limit(1);

  // Get all candidate beans, excluding yesterday's BOTD if one exists
  let candidates;
  if (yesterdayEntry) {
    // Exclude yesterday's bean from the candidates
    candidates = await db
      .select()
      .from(beans)
      .where(ne(beans.id, yesterdayEntry.beanId));
  } else {
    // No yesterday entry (e.g. first time running), so all beans are candidates
    candidates = await db.select().from(beans);
  }

  // Edge case: if no candidates found (shouldn't happen), grab any bean as fallback
  if (candidates.length === 0) {
    const [fallback] = await db.select().from(beans).limit(1);
    return fallback ?? null;
  }

  // --- Step 3: Pick a random bean from the candidates ---
  const selected = candidates[Math.floor(Math.random() * candidates.length)];

  // --- Step 4: Update the database ---

  // Clear the isBOTD flag on ALL beans (set to 0)
  await db.update(beans).set({ isBOTD: 0 });

  // Set isBOTD = 1 on only the selected bean
  await db.update(beans).set({ isBOTD: 1 }).where(eq(beans.id, selected.id));

  // Record this selection in the history table so we return the same bean all day
  await db.insert(botdHistory).values({ beanId: selected.id, date: today });

  return selected;
}
