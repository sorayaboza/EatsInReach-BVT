import { NextResponse } from "next/server";
import { pool } from "@/data/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get('uid');

  if (!uid) {
    return res.status(400).json({ error: "UID is required" });
  }

  try {
    // Query the `restaurants` table to check if a restaurant exists with the given UID
    const query = "SELECT * FROM restaurants WHERE uid = $1";
    const values = uid;
    
    const result = await pool.query(query, [values]);

    if (result.rows.length > 0) {
      return NextResponse.json({ hasRestaurant: true });
    } else {
      return NextResponse.json({ hasRestaurant: false });
    }
  } catch (error) {
    console.error("Error checking restaurant:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
