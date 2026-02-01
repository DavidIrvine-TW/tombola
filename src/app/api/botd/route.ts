/**
 * Bean of the Day API Route
 *
 * GET /api/botd
 *
 * Returns today's featured bean. The selection logic is handled by
 * the getBeanOfTheDay() service function in src/lib/botd.ts.
 *
 * The `dynamic = 'force-dynamic'` export tells Next.js to never cache
 * this route - it should always run the handler fresh, since the BOTD
 * can change between days.
 */

import { NextResponse } from 'next/server';
import { getBeanOfTheDay } from '@/lib/botd';

// Prevent Next.js from caching this route's response
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the BOTD (selects a new one if none exists for today)
    const bean = await getBeanOfTheDay();

    // Return 404 if the database has no beans at all
    if (!bean) {
      return NextResponse.json({ error: 'No beans available' }, { status: 404 });
    }

    // Return the bean as JSON
    return NextResponse.json(bean);
  } catch (error) {
    console.error('Error fetching BOTD:', error);
    return NextResponse.json({ error: 'Failed to fetch Bean of the Day' }, { status: 500 });
  }
}
