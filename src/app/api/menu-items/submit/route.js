import { NextResponse } from 'next/server';
import { pool } from '@/data/db';

export async function POST(req) {
  const { item_name, item_description, item_price, image_path, alt_text } = await req.json();
  const uid = req.headers.get('uid'); // Get the uid from the request headers
  const menuId = req.headers.get('menuId'); // Get the menuId from the request headers

  if (!menuId) {
    return new Response(JSON.stringify({ error: 'menuId is required' }), { status: 400 });
  }

  try {
    // Check if the restaurant exists for the user
    const restaurantQuery = `
      SELECT r.restaurant_id 
      FROM Restaurants r
      JOIN Menus m ON r.restaurant_id = m.restaurant_id
      WHERE r.uid = $1 AND m.menu_id = $2
      LIMIT 1;  
    `;

    const restaurantResult = await pool.query(restaurantQuery, [uid, menuId]);

    if (restaurantResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'No restaurant found for the user or invalid menuId' }), { status: 404 });
    }

    // Insert the new menu item with the provided menuId
    const query = `
      INSERT INTO menu_items (menu_id, item_name, item_description, item_price, image_path, alt_text)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING item_id;
    `;
    
    const values = [menuId, item_name, item_description, item_price, image_path, alt_text];
    const { rows } = await pool.query(query, values);

    const newItemId = rows[0].item_id;

    const newItem = {
      item_id: newItemId,
      menu_id: menuId,
      item_name,
      item_description,
      item_price,
      image_path,
      alt_text,
    };

    return new Response(JSON.stringify(newItem), { status: 201 });
  } catch (error) {
    console.error("Error adding menu item:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
