import { Pool, PoolClient } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
});

// Updated types to reflect optional values
pool.connect((err: Error | undefined, client: PoolClient | undefined, release: (() => void) | undefined) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
    return;
  }

  if (client && release) {
    console.log("Connected to PostgreSQL database!");
    release();
  }
});

pool.on("error", (err: Error) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
