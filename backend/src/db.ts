import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// In production (e.g. Neon/Render) a single DATABASE_URL connection string is provided.
// Locally we fall back to the individual DB_* variables. Managed Postgres requires SSL.
export const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    })
    : new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT), // The port should be a number, so we need to convert it from a string to a number
        database: process.env.DB_NAME,
    });