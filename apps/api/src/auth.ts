import type { FastifyRequest } from "fastify";
import { config } from "./config.js";

export function getCurrentUserEmail(req: FastifyRequest): string {
  if (config.authMode === "local") {
    const header = req.headers["x-dev-user-email"];
    if (typeof header === "string" && header.length > 0) return header;
    return config.devUserEmail;
  }

  throw new Error("Azure AD mode not implemented in skeleton yet.");
}
