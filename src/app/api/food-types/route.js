import { pool } from '@/data/db'; // Update the path according to your project structure

export async function GET() {
    try {
        const result = await pool.query('SELECT food_type_id, type_name FROM Food_Types');
        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch food types' }), {
            status: 500,
        });
    }
}
