/**
 * Beans List API Route
 *
 * GET /api/beans
 *
 * Returns all coffee beans from the database. Supports optional query parameters
 * for searching and filtering:
 *
 *   ?search=text   - Searches bean name, description, and country (case-insensitive)
 *   ?country=Brazil - Filters by exact country match
 *   ?colour=green   - Filters by exact roast type match
 *
 * Multiple filters can be combined, e.g. /api/beans?country=Brazil&colour=green
 * All filters are ANDed together (must match all specified filters).
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { beans } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');   // Free text search term
    const country = searchParams.get('country'); // Country filter (exact match)
    const colour = searchParams.get('colour');   // Roast type filter (exact match)

    // Build an array of SQL conditions based on which filters are provided
    const conditions = [];

    // Search filter: uses SQL LIKE to match against name, description, or country
    // The % wildcards make it a "contains" search (matches anywhere in the string)
    if (search) {
      conditions.push(
        sql`(LOWER(${beans.name}) LIKE LOWER(${'%' + search + '%'}) OR LOWER(${beans.description}) LIKE LOWER(${'%' + search + '%'}) OR LOWER(${beans.country}) LIKE LOWER(${'%' + search + '%'}))`
      );
    }

    // Country filter: exact match using Drizzle's eq() (equals) function
    if (country) {
      conditions.push(eq(beans.country, country));
    }

    // Colour/roast filter: exact match
    if (colour) {
      conditions.push(eq(beans.colour, colour));
    }

    // Execute the query, applying conditions with AND if any filters exist
    // Results are always sorted by the original index for consistent ordering
    const results =
      conditions.length > 0
        ? await db.select().from(beans).where(and(...conditions)).orderBy(beans.index).all()
        : await db.select().from(beans).orderBy(beans.index).all();

    // Return the beans array as JSON
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching beans:', error);
    return NextResponse.json({ error: 'Failed to fetch beans' }, { status: 500 });
  }
}
