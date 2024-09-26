import { pool } from '@/data/db';

export async function GET() {
    try {
        const result = await pool.query('SELECT price_range_id, range FROM Price_Ranges');
        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch price ranges' }), {
            status: 500,
        });
    }
}
