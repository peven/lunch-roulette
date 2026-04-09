import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { pool } from "../db.js";

const schema = z.object({
  userId: z.string().uuid(),
  officeId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  lunchDate: z.string(),
  mode: z.enum(["dine_in", "takeaway"])
});

export async function lunchIntentionRoutes(app: FastifyInstance) {
  app.post("/intentions", async (req, reply) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());

    const { userId, officeId, restaurantId, lunchDate, mode } = parsed.data;

    const { rows } = await pool.query(
      `INSERT INTO lunch_intentions (user_id, office_id, restaurant_id, lunch_date, mode)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, lunch_date)
       DO UPDATE SET office_id = EXCLUDED.office_id,
                     restaurant_id = EXCLUDED.restaurant_id,
                     mode = EXCLUDED.mode
       RETURNING *`,
      [userId, officeId, restaurantId, lunchDate, mode]
    );

    return rows[0];
  });
}
