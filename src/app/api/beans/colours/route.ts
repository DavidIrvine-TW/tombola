/**
 * Bean Colours (Roast Types) API Route
 *
 * GET /api/beans/colours
 *
 * Returns a sorted array of unique roast type names from all beans.
 * Used by the SearchFilter component to populate the roast type dropdown.
 *
 * Example response: ["dark roast", "golden", "green", "light roast", "medium roast"]
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { beans } from '@/lib/db/schema';

export async function GET() {
  try {
    // selectDistinct ensures each colour/roast type appears only once
    const results = await db
      .selectDistinct({ colour: beans.colour })
      .from(beans)
      .orderBy(beans.colour) // Sort alphabetically
      .all();

    // Map from array of objects [{colour: "green"}, ...] to array of strings ["green", ...]
    return NextResponse.json(results.map((r) => r.colour));
  } catch (error) {
    console.error('Error fetching colours:', error);
    return NextResponse.json({ error: 'Failed to fetch colours' }, { status: 500 });
  }
}
