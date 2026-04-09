import type { FastifyInstance } from "fastify";
import { pool } from "../db.js";

function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export async function restaurantRoutes(app: FastifyInstance) {
  app.get("/restaurants", async (req, reply) => {
    const officeId = (req.query as { officeId?: string }).officeId;

    const { rows: restaurantRows } = await pool.query(
      `SELECT id, name, address, lat, lng, food_style, takeaway, delivery,
              vegetarian_friendly, vegan_options, accepts_own_bowls
       FROM restaurants
       ORDER BY name`
    );

    if (!officeId) return restaurantRows;

    const { rows: officeRows } = await pool.query(
      "SELECT id, lat, lng FROM offices WHERE id = $1",
      [officeId]
    );

    if (officeRows.length === 0) {
      return reply.code(400).send({ message: "Invalid officeId" });
    }

    const office = officeRows[0] as { lat: number; lng: number };

    return restaurantRows.map((restaurant) => {
      if (restaurant.lat == null || restaurant.lng == null) {
        return { ...restaurant, distance_meters: null };
      }

      return {
        ...restaurant,
        distance_meters: haversineMeters(
          office.lat,
          office.lng,
          restaurant.lat,
          restaurant.lng
        )
      };
    });
  });
}
