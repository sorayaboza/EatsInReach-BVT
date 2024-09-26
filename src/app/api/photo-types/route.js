import { pool } from 'pg';

export async function GET(request) {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM Photo_Types');
        client.release();
        return new Response(JSON.stringify(result.rows), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching photo types:', error);
        return new Response(JSON.stringify({ message: 'Error fetching photo types' }), { status: 500 });
    }
}
