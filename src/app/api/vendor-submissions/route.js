import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure you have DATABASE_URL in your .env file
});

export async function GET() {
  try {
    const client = await pool.connect();

    const result = await client.query(`
            SELECT
                vs.uid,
                vs.name,
                vs.location,
                vs.hours_of_operation,
                vs.description,
                vs.website,
                vs.phone_number,
                vs.email,
                pr.range AS price_range,
                ft.type_name AS food_type,
                rp.image_url -- Add this line to fetch the image URL
            FROM Vendor_Submissions vs
            JOIN Price_Ranges pr ON vs.price_range_id = pr.price_range_id
            JOIN Food_Types ft ON vs.food_type_id = ft.food_type_id
            LEFT JOIN Vendor_Restaurant_Pictures rp ON vs.uid = rp.uid -- Adjust JOIN as needed
        `);

    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching vendor submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor submissions" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      uid,
      name,
      location,
      hours_of_operation,
      description,
      website,
      phone_number,
      email,
      price_range_id,
      food_type_id,
      image,
      alt_text,
    } = data;

    const client = await pool.connect();

    await client.query("BEGIN");

    // Insert vendor submission
    const result = await client.query(
      `INSERT INTO Vendor_Submissions (
                uid, name, location, hours_of_operation, description, website,
                phone_number, email, price_range_id, food_type_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        uid,
        name,
        location,
        JSON.stringify(hours_of_operation), // Store hours_of_operation as JSONB
        description,
        website,
        phone_number,
        email,
        price_range_id,
        food_type_id,
      ]
    );

    // Insert a single image with photo_type_id set to 4
    const imageUrl = image; // Assuming image is passed as base64 or URL
    const photoType = 4; // Automatically set photo_type_id to 4

    await client.query(
      `INSERT INTO Vendor_Restaurant_Pictures (uid, image_url, photo_type_id, alt_text) 
            VALUES ($1, $2, $3, $4)`,
      [uid, imageUrl, photoType, alt_text]
    );

    await client.query("COMMIT");
    client.release();

    return NextResponse.json({ message: "Submission successful!" });
  } catch (error) {
    console.error("Error handling submission:", error);
    return NextResponse.json(
      { message: "Error handling submission", error: error.message },
      { status: 500 }
    );
  }
}
