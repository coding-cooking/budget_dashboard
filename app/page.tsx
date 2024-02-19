import { ExpenseDashboard } from '@/components/ExpenseDashboard/Dashboard';
import { Pool } from 'pg';

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true
// });

// async function getData() {
//   const client = await pool.connect();
//   try {
//     const response = await client.query('SELECT user_id FROM expenses GROUP BY user_id');
//     // console.log(response);
//     return response;
//   } finally {
//     client.release();
//   }
// }

export default async function HomePage() {
  // const data = await getData();
  return <ExpenseDashboard />
}
