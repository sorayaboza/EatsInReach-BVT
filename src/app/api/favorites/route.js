import { pool } from "@/data/db";

export async function GET(req) {
  // Use `req.nextUrl.searchParams` to get the query parameters in the App Router
  const user_id = req.nextUrl.searchParams.get("user_id");
  const restaurant_id = req.nextUrl.searchParams.get("restaurant_id");

  if (!user_id) {
    return new Response("User ID is missing", { status: 400 });
  }

  // Check if the restaurant_id is provided to handle specific favorite status check
  if (restaurant_id) {
    const favoriteCheckQuery = `
        SELECT 1
        FROM Favorites
        WHERE uid = $1 AND restaurant_id = $2;
      `;

    try {
      const { rowCount } = await pool.query(favoriteCheckQuery, [
        user_id,
        restaurant_id,
      ]);

      // Return true if the favorite exists, otherwise false
      const isFavorited = rowCount > 0;
      return new Response(JSON.stringify({ isFavorited }), { status: 200 });
    } catch (error) {
      console.error("Error checking favorite status.", error);
      return new Response("Error", { status: 500 });
    }
  }

  const query = `
    SELECT Restaurants.*, Restaurant_Pictures.image_url, Restaurant_Pictures.alt_text
    FROM Favorites
    JOIN Restaurants ON Favorites.restaurant_id = Restaurants.restaurant_id
    LEFT JOIN Restaurant_Pictures ON Restaurants.restaurant_id = Restaurant_Pictures.restaurant_id
    WHERE Favorites.uid = $1
    AND Restaurant_Pictures.photo_type_id = 4;
    `;

  try {
    const { rows } = await pool.query(query, [user_id]);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching favorites.", error);
    return new Response("Error", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { user_id, restaurant_id } = await req.json();

    const query = `
            INSERT INTO Favorites(uid, restaurant_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING;
        `;

    await pool.query(query, [user_id, restaurant_id]);
    return new Response("Favorited", { status: 200 });
  } catch (error) {
    console.error("Error favoriting restaurant", error);
    return new Response("Error", { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { user_id, restaurant_id } = await req.json();

    const query = `
            DELETE FROM Favorites
            WHERE uid = $1 AND restaurant_id = $2;
        `;

    await pool.query(query, [user_id, restaurant_id]);
    return new Response("Unfavorited", { status: 200 });
  } catch (error) {
    console.error("Error removing favorite", error);
    return new Response("Error", { status: 500 });
  }
}
