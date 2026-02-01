/**
 * Single Bean API Route
 *
 * GET /api/beans/:id
 *
 * Returns a single coffee bean by its database ID.
 * The :id parameter comes from the folder name [id] (Next.js dynamic route).
 *
 * Returns 400 if the ID is not a valid number.
 * Returns 404 if no bean exists with that ID.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { beans } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // Next.js passes dynamic route params here
) {
  try {
    // Parse the ID from the URL parameter (it comes as a string, we need a number)
    const id = parseInt(params.id, 10);

    // Validate that the ID is actually a number
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid bean ID' }, { status: 400 });
    }

    // Query the database for a bean with this ID
    const bean = await db.select().from(beans).where(eq(beans.id, id)).get();

    // Return 404 if no bean was found
    if (!bean) {
      return NextResponse.json({ error: 'Bean not found' }, { status: 404 });
    }

    // Return the bean as JSON
    return NextResponse.json(bean);
  } catch (error) {
    console.error('Error fetching bean:', error);
    return NextResponse.json({ error: 'Failed to fetch bean' }, { status: 500 });
  }
}
