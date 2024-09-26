import { NextResponse } from 'next/server';
import { pool } from '@/data/db';

export async function DELETE(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new NextResponse.error(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete user from PostgreSQL Users table
    const query = 'DELETE FROM Users WHERE uid = $1';
    await pool.query(query, [userId]);

    return NextResponse.json(JSON.stringify({ message: 'User deleted from PostgreSQL successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting user from PostgreSQL:', error);
    return NextResponse.error(JSON.stringify({ error: 'Failed to delete user from PostgreSQL' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
