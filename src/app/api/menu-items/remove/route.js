import { NextResponse } from 'next/server';
import { pool } from '@/data/db'; // Ensure that pool is correctly exported from '@/data/db'

export async function POST(req) {
    try {
        const body = await req.json();
        const { item_id } = body; // Expecting item_id to identify the item to remove

        // Validate input
        if (!item_id) {
            return NextResponse.json({ error: 'Validation failed: item_id must be provided' }, { status: 400 });
        }

        // Construct the query with the correct column name
        const query = `
            DELETE FROM Menu_Items 
            WHERE item_id = $1 
            RETURNING *;
        `;
        const values = [item_id];

        // Execute the query
        const result = await pool.query(query, values);

        // Check if an item was deleted
        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // Return the deleted item
        return NextResponse.json(result.rows[0], { status: 200 });

    } catch (error) {
        console.error('Error removing vendor item:', error);
        return NextResponse.json({ error: 'Failed to remove vendor item' }, { status: 500 });
    }
}