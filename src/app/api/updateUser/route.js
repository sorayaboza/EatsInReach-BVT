import { NextResponse } from 'next/server';
import { pool } from '@/data/db';

export async function POST(req) {
    const { userId, role } = await req.json(); // Get data from request body
  
    try {
      // Insert item into the database and get the inserted row
      await pool.query(
        "UPDATE users SET role = $1 WHERE uid = $2",
        [role, userId]
      );
      return NextResponse.json({message: 'User added successfully' }); // Return the new item as JSON
    } catch (err) {
      console.error('Error adding user to SQL:', err); // Log any errors
      return NextResponse.error(); // Return a generic error response
    }
  }