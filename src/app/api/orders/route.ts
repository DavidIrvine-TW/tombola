/**
 * Orders API Route
 *
 * POST /api/orders
 *
 * Creates a new order for a coffee bean. Expects a JSON body with:
 *   - beanId: number        (the ID of the bean being ordered)
 *   - customerName: string  (customer's full name)
 *   - email: string         (customer's email address)
 *   - quantity: number      (number of units to order, must be >= 1)
 *
 * The route validates all inputs, looks up the bean to get its price,
 * calculates the total cost (unit price × quantity), and creates the order.
 *
 * Returns the created order with a 201 status on success.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { beans, orders } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db
      .select({
        id: orders.id,
        beanName: beans.name,
        customerName: orders.customerName,
        email: orders.email,
        quantity: orders.quantity,
        totalCost: orders.totalCost,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .innerJoin(beans, eq(orders.beanId, beans.id))
      .orderBy(desc(orders.createdAt))
      .all();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await db.delete(orders).run();
    return NextResponse.json({ message: 'All orders cleared' });
  } catch (error) {
    console.error('Error clearing orders:', error);
    return NextResponse.json({ error: 'Failed to clear orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON request body
    const body = await request.json();
    const { beanId, customerName, email, quantity } = body;

    // --- Input Validation ---

    // Check that all required fields are present
    if (!beanId || !customerName || !email || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: beanId, customerName, email, quantity' },
        { status: 400 }
      );
    }

    // Validate email format using a simple regex pattern
    // Checks for: something@something.something
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate that quantity is a positive number
    if (typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json({ error: 'Quantity must be a positive number' }, { status: 400 });
    }

    // --- Look up the bean ---

    // Find the bean in the database to verify it exists and get its price
    const bean = await db.select().from(beans).where(eq(beans.id, beanId)).get();
    if (!bean) {
      return NextResponse.json({ error: 'Bean not found' }, { status: 404 });
    }

    // --- Calculate total cost ---

    // Extract the numeric price from the cost string (e.g. "£39.26" → 39.26)
    const priceMatch = bean.cost.match(/[\d.]+/);
    if (!priceMatch) {
      return NextResponse.json({ error: 'Invalid bean price format' }, { status: 500 });
    }
    const unitPrice = parseFloat(priceMatch[0]);
    // Multiply by quantity and format as a price string with £ symbol
    const totalCost = `£${(unitPrice * quantity).toFixed(2)}`;

    // --- Create the order ---

    // Insert the order into the database and return the created row
    // `.returning()` tells Drizzle to return the inserted row (including auto-generated fields)
    // `.get()` extracts the single result (since we're inserting one row)
    const result = await db
      .insert(orders)
      .values({
        beanId,
        customerName,
        email,
        quantity,
        totalCost,
      })
      .returning()
      .get();

    // Return the created order with the bean name included for convenience
    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: { ...result, beanName: bean.name },
      },
      { status: 201 } // 201 = Created
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
