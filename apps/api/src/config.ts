import "dotenv/config";

export const config = {
  port: Number(process.env.API_PORT ?? 4000),
  dbUrl:
    process.env.DATABASE_URL ??
    "postgres://postgres:postgres@localhost:5432/lunch_roulette",
  authMode: process.env.AUTH_MODE ?? "local",
  devUserEmail: process.env.DEV_USER_EMAIL ?? "alice@example.com"
};
