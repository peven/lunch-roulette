import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { pool } from "../db.js";

const reviewSchema = z.object({
  lunchIntentionId: z.string().uuid(),
  userId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  tags: z.array(z.string()).optional(),
  comment: z.string().optional()
});

export async function reviewRoutes(app: FastifyInstance) {
  app.post("/reviews", async (req, reply) => {
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error.flatten());

    const { lunchIntentionId, userId, restaurantId, rating, tags, comment } = parsed.data;

    const { rows } = await pool.query(
      `INSERT INTO reviews (lunch_intention_id, user_id, restaurant_id, rating, tags_json, comment)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6)
       ON CONFLICT (user_id, lunch_intention_id)
       DO UPDATE SET rating = EXCLUDED.rating,
                     tags_json = EXCLUDED.tags_json,
                     comment = EXCLUDED.comment
       RETURNING *`,
      [lunchIntentionId, userId, restaurantId, rating, JSON.stringify(tags ?? []), comment ?? null]
    );

    return rows[0];
  });
}
