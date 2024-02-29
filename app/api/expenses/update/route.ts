import { NextRequest } from "next/server";
import { getPoolClient } from "@/library/database";

export const PUT = async (req: NextRequest) => {
    const {id, user_id, date, coffee_expense, food_expense, alcohol_expense } = await req.json();
    let client;

    console.log(id, user_id, date, coffee_expense, food_expense, alcohol_expense);

    if (!user_id) {
        return new Response("User ID is required", { status: 400 });
    }

    try {
        console.log('user is ', user_id);
        client = await getPoolClient();
        await client.query(
            "UPDATE expenses SET user_id = $1, date = $2, coffee_expense = $3, food_expense = $4, alcohol_expense = $5 WHERE id = $6",
            [user_id, date, coffee_expense, food_expense, alcohol_expense, id]
        );
        console.log(id, user_id, coffee_expense)
        return new Response("Expense updated successfully", { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Failed to update new expense", { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}