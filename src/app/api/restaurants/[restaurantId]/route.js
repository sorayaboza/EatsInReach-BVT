// src/app/api/restaurants/[restaurantId]/route.js
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET(req, { params }) {
    const { restaurantId } = params;

    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT r.restaurant_id, r.name, r.location AS address, r.price_range_id, r.phone_number, r.email, f.type_name AS food_type, r.hours_of_operation, r.description, rp.image_url
            FROM Restaurants r
            JOIN Food_Types f ON r.food_type_id = f.food_type_id
            LEFT JOIN Restaurant_Pictures rp ON r.restaurant_id = rp.restaurant_id
            WHERE r.restaurant_id = $1
        `, [restaurantId]);
        client.release();

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        const restaurant = result.rows[0];

        return NextResponse.json(restaurant);
    } catch (error) {
        console.error('Error fetching restaurant details:', error);
        return NextResponse.json({ error: 'Failed to fetch restaurant details' }, { status: 500 });
    }
}
