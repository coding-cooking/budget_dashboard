import { NextRequest } from "next/server";
import { getPoolClient } from "@/library/database";

export const PATCH = async (req: NextRequest) => {
    const { user_id, date, coffee_expense, food_expense, alcohol_expense } = await req.json();
    let client;

    if (!user_id) {
        return new Response("User ID is required", { status: 400 });
    }

    try {
        client = await getPoolClient();
        const queryText = 'INSERT INTO expenses(user_id, date, coffee_expense, food_expense, alcohol_expense) VALUES ($1, $2, $3, $4, $5)';
        const values = [user_id, date, coffee_expense, food_expense, alcohol_expense];
        await client.query(queryText, values);
        return new Response("Expense created successfully", { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Failed to create new expense", { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}