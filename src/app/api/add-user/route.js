import { NextResponse } from "next/server";
import { pool } from "@/data/db";

export async function POST(req) {
  const { uid, username, email, role } = await req.json(); // Get data from request body

  try {
    // Insert item into the database and get the inserted row
    const { rows } = await pool.query(
      "INSERT INTO Users (uid, username, email, role) VALUES ($1, $2, $3, $4)",
      [uid, username, email, role]
    );
    return NextResponse.json({
      data: rows[0],
      message: "User added successfully",
    }); // Return the new item as JSON
  } catch (err) {
    console.error("Error adding user to SQL:", err); // Log any errors
    return NextResponse.error(); // Return a generic error response
  }
}
