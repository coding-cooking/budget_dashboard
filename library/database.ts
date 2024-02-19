import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});


export async function getPoolClient() {
    try {
        const client = await pool.connect();
        console.log("PostgrSQL connected")
        return client;
    } catch (error) {
        console.error('Failed to connect to PostgreSQL', error);
        throw error;
    }
}