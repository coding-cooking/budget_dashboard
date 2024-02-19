import { getPoolClient } from "@/library/database";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

    let client;

    try {
        client = await getPoolClient();
        const response = await client.query('SELECT * FROM expenses');
        console.log(response.rows);
        return new Response(JSON.stringify(response.rows), {
            status: 200
        })
    } catch (error) {
        return new Response("Failed to fetch all expenses", { status: 500 })
    } finally {
        if (client) {
            client.release();
        }
    }
}