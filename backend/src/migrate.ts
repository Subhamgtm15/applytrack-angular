import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db";

// A tiny, dependency-free migration runner.
//
// It executes every .sql file in the /migrations folder in alphabetical order,
// and records each applied file in a `schema_migrations` table so it is never
// run twice. To add a migration, just drop a new .sql file in that folder and
// run `npm run migrate`.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "..", "migrations");

async function runMigrations() {
  const client = await pool.connect();

  try {
    // Track which migration files have already been applied.
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    // All .sql files, sorted so they run in a deterministic order.
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    // Which ones already ran?
    const { rows } = await client.query<{ name: string }>(
      "SELECT name FROM schema_migrations"
    );
    const applied = new Set(rows.map((row) => row.name));

    const pending = files.filter((file) => !applied.has(file));

    if (pending.length === 0) {
      console.log("No pending migrations. Database is up to date.");
      return;
    }

    for (const file of pending) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

      // Each migration runs in its own transaction: if any statement fails,
      // the whole file is rolled back and it is NOT marked as applied.
      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
        await client.query("COMMIT");
        console.log(`Applied: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`Migration failed: ${file}\n${(error as Error).message}`);
      }
    }

    console.log(`Done. Applied ${pending.length} migration(s).`);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
