import type { FastifyInstance } from "fastify";
import { pool } from "../db.js";
import { getCurrentUserEmail } from "../auth.js";

export async function userRoutes(app: FastifyInstance) {
  app.get("/users", async () => {
    const { rows } = await pool.query(
      "SELECT id, email, display_name, role, default_office_id FROM users ORDER BY display_name"
    );
    return rows;
  });

  app.get("/me", async (req) => {
    const email = getCurrentUserEmail(req);

    const { rows } = await pool.query(
      "SELECT id, email, display_name, role, default_office_id FROM users WHERE email = $1",
      [email]
    );

    if (rows.length > 0) return rows[0];

    const inserted = await pool.query(
      `INSERT INTO users (email, display_name, role)
       VALUES ($1, $2, 'user')
       RETURNING id, email, display_name, role, default_office_id`,
      [email, email.split("@")[0]]
    );

    return inserted.rows[0];
  });
}
