import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { pool } from "../db.js";

const spinSchema = z.object({
  officeId: z.string().uuid(),
  createdBy: z.string().uuid(),
  lunchDate: z.string(),
  shortlistRestaurantIds: z.array(z.string().uuid()).min(1)
});

export async function rouletteRoutes(app: FastifyInstance) {
  app.post("/roulette/spin", async (req, reply) => {
    const parsed = spinSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());

    const { officeId, createdBy, lunchDate, shortlistRestaurantIds } = parsed.data;
    const selected =
      shortlistRestaurantIds[Math.floor(Math.random() * shortlistRestaurantIds.length)];

    const { rows } = await pool.query(
      `INSERT INTO roulette_sessions
      (office_id, created_by, lunch_date, shortlist_restaurant_ids_json, selected_restaurant_id)
      VALUES ($1, $2, $3, $4::jsonb, $5)
      RETURNING *`,
      [officeId, createdBy, lunchDate, JSON.stringify(shortlistRestaurantIds), selected]
    );

    return rows[0];
  });
}
