import { pool } from '@/data/db';

export async function GET(req) {
    const uid = req.headers.get('uid'); // Assuming you pass the uid in the request headers
    const menuId = req.headers.get('menuId');

    console.log(menuId);
    if (!uid) {
        return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
    }

    const client = await pool.connect();
    
    try {
        const query = `
            SELECT
                mi.item_id,
                mi.menu_id,
                mi.item_name,
                mi.item_description,
                mi.item_price,
                m.restaurant_id
            FROM Menu_Items mi
            JOIN Menus m ON mi.menu_id = m.menu_id
            JOIN Restaurants r ON m.restaurant_id = r.restaurant_id
            WHERE r.uid = $1 AND mi.menu_id = $2
        `;

        const result = await client.query(query, [uid, menuId]);
        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch menu items' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        client.release();
    }
}
