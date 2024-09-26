import { NextResponse } from 'next/server';
import { pool } from '@/data/db';

export async function POST(req) {
    try {
        const body = await req.json();
        console.log(body)
        const { id, menu_id, item_name, item_description, item_price, image_path, alt_text } = body;

        // Validate input
        if (!id || !menu_id || !item_name || !item_description || !item_price) {
            return NextResponse.json({ error: 'Validation failed: All required fields must be provided' }, { status: 400 });
        }

        // Construct the query and values
        const query = `
            UPDATE Menu_Items
            SET menu_id = $1,
                item_name = $2,
                item_description = $3,
                item_price = $4,
                image_path = $5,
                alt_text = $6
            WHERE item_id = $7
            RETURNING *;
        `;
        const values = [menu_id, item_name, item_description, item_price, image_path || null, alt_text || null, id];

        // Execute the query
        const result = await pool.query(query, values);

        // Check if an item was updated
        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // Return the updated item
        return NextResponse.json(result.rows[0], { status: 200 });

    } catch (error) {
        console.error('Error updating vendor item:', error);
        return NextResponse.json({ error: 'Failed to update vendor item' }, { status: 500 });
    }
}
