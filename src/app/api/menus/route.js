import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Ensure DATABASE_URL is in your .env file
});

export async function POST(req) {
    const { menuName, description, uid } = await req.json();

    if (!menuName || !uid) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const client = await pool.connect();

        // Fetch the restaurant_id by comparing the user's uid in the Restaurants table
        const restaurantQuery = await client.query(
            'SELECT restaurant_id FROM Restaurants WHERE uid = $1',
            [uid]
        );

        if (restaurantQuery.rows.length === 0) {
            client.release();
            return NextResponse.json({ error: 'Restaurant not found for the given user' }, { status: 404 });
        }

        const restaurantId = restaurantQuery.rows[0].restaurant_id;

        // Insert the new menu into the Menus table
        const result = await client.query(
            'INSERT INTO Menus (restaurant_id, name, description) VALUES ($1, $2, $3) RETURNING *',
            [restaurantId, menuName, description]
        );

        client.release();

        return NextResponse.json({ message: 'Menu created successfully', menu: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Error creating menu:', error);
        return NextResponse.json({ error: 'Failed to create menu' }, { status: 500 });
    }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid'); // Get uid from query parameters

    if (!uid) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const client = await pool.connect();

        // Fetch the restaurant_id by comparing the user's uid in the Restaurants table
        const menus = await client.query(
            'SELECT * FROM Menus WHERE restaurant_id IN (SELECT restaurant_id FROM Restaurants WHERE uid = $1)',
            [uid]
          );

        if (menus.rows.length === 0) {
            client.release();
            return NextResponse.json({ error: 'Restaurant not found for the given user' }, { status: 404 });
        }

        client.release();

        return NextResponse.json({ menus: menus.rows }, { status: 200 });
    } catch (error) {
        console.error('Error creating menu:', error);
        return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
    }
}