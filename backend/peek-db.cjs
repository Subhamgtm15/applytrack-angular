const { Client } = require("pg");

const c = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  await c.connect();

  const users = await c.query(
    'SELECT user_id, "fullName", email, current_position FROM users ORDER BY user_id DESC'
  );
  console.log(`\nUSERS (${users.rowCount}):`);
  console.table(users.rows);

  const apps = await c.query(
    "SELECT id, company, role, status, date_applied, user_id FROM applications ORDER BY id DESC"
  );
  console.log(`\nAPPLICATIONS (${apps.rowCount}):`);
  console.table(apps.rows);

  await c.end();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
