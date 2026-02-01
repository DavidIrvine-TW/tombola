/**
 * Bean Countries API Route
 *
 * GET /api/beans/countries
 *
 * Returns a sorted array of unique country names from all beans.
 * Used by the SearchFilter component to populate the country dropdown.
 *
 * Example response: ["Brazil", "Colombia", "Honduras", "Peru", "Vietnam"]
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { beans } from '@/lib/db/schema';

export async function GET() {
  try {
    // selectDistinct ensures each country appears only once (like SQL's SELECT DISTINCT)
    // We only select the country column since that's all we need
    const results = await db
      .selectDistinct({ country: beans.country })
      .from(beans)
      .orderBy(beans.country) // Sort alphabetically
      .all();

    // Map from array of objects [{country: "Brazil"}, ...] to array of strings ["Brazil", ...]
    return NextResponse.json(results.map((r) => r.country));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
  }
}
