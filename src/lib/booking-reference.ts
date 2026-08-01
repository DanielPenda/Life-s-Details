import { createHash, randomBytes } from "node:crypto";

export function createBookingReference(now = new Date()) {
  const year = now.getUTCFullYear();
  return `LD-${year}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export function hashBookingAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
