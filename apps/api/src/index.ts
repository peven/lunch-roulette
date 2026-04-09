import Fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "./config.js";
import { healthRoutes } from "./routes/health.js";
import { officeRoutes } from "./routes/offices.js";
import { restaurantRoutes } from "./routes/restaurants.js";
import { lunchIntentionRoutes } from "./routes/lunchIntentions.js";
import { rouletteRoutes } from "./routes/roulette.js";
import { reviewRoutes } from "./routes/reviews.js";
import { userRoutes } from "./routes/users.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(healthRoutes);
await app.register(userRoutes);
await app.register(officeRoutes);
await app.register(restaurantRoutes);
await app.register(lunchIntentionRoutes);
await app.register(rouletteRoutes);
await app.register(reviewRoutes);

app.listen({ port: config.port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
