import type { FastifyInstance } from "fastify";
import { pool } from "../db.js";

export async function officeRoutes(app: FastifyInstance) {
  app.get("/offices", async () => {
    const { rows } = await pool.query(
      "SELECT id, name, address, lat, lng, timezone, is_active FROM offices WHERE is_active = TRUE ORDER BY name"
    );
    return rows;
  });
}
