//import pg from "pg";
import dotenv from 'dotenv';

dotenv.config();

// const db=new pg.Client({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT,
// });

// async function check() {
//     await db.connect();
// }

// check();
// export default db;

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// const db=await pool.connect();
// export default db;
// export default {
//   query: (text, params) => pool.query(text, params),
// };

export default pool;
