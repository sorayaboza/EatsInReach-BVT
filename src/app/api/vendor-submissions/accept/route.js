// src/app/api/vendor-submissions/accept/route.js
import { pool } from "@/data/db"; // Adjust import path based on your project structure

export async function POST(request) {
  const { submissionId } = await request.json();

  if (!submissionId) {
    return new Response(
      JSON.stringify({ message: "Submission ID is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Fetch the submission data
    const result = await pool.query(
      "SELECT * FROM Vendor_Submissions WHERE uid = $1",
      [submissionId]
    );
    const submission = result.rows[0];

    const picture_results = await pool.query(
      "SELECT * FROM Vendor_Restaurant_Pictures WHERE uid = $1",
      [submissionId]
    );
    const picture_submission = picture_results.rows[0];

    if (!submission) {
      return new Response(JSON.stringify({ message: "Submission not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if price_range_id and food_type_id are valid
    const [priceRangeResult, foodTypeResult] = await Promise.all([
      pool.query("SELECT 1 FROM Price_Ranges WHERE price_range_id = $1", [
        submission.price_range_id,
      ]),
      pool.query("SELECT 1 FROM Food_Types WHERE food_type_id = $1", [
        submission.food_type_id,
      ]),
    ]);

    if (priceRangeResult.rowCount === 0 || foodTypeResult.rowCount === 0) {
      return new Response(
        JSON.stringify({ message: "Invalid price range or food type ID" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Insert into Restaurants and get the new restaurant_id
    const insertRestaurantResult = await pool.query(
      `INSERT INTO Restaurants (uid, name, location, hours_of_operation, description, website, phone_number, email, price_range_id, food_type_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING restaurant_id`,
      [
        submission.uid,
        submission.name,
        submission.location,
        submission.hours_of_operation,
        submission.description,
        submission.website,
        submission.phone_number,
        submission.email,
        submission.price_range_id,
        submission.food_type_id,
      ]
    );
    const newRestaurantId = insertRestaurantResult.rows[0].restaurant_id;
    // Automatically set photo_type_id to 4 and use the uploaded image URL
    const imageUrl = picture_submission.image_url;
    const photoType = 4; // Automatically set photo_type_id to 4

    await pool.query(
      `INSERT INTO Restaurant_Pictures (restaurant_id, photo_type_id, image_url, alt_text) 
            VALUES ($1, $2, $3, $4)`,
      [newRestaurantId, photoType, imageUrl, picture_submission.alt_text]
    );

    // Delete from Vendor_Submissions
    await pool.query("DELETE FROM Vendor_Submissions WHERE uid = $1", [
      submissionId,
    ]);

    // Commit the transaction
    await pool.query("COMMIT");

    return new Response(
      JSON.stringify({
        message: "Submission accepted and added to Restaurants",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error handling accept request:", error);

    // Rollback the transaction in case of error
    await pool.query("ROLLBACK");

    return new Response(
      JSON.stringify({ message: "Failed to accept submission" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
