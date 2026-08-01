import { describe, expect, it } from "vitest";
import { checkBookingRateLimit } from "./rate-limit";

describe("booking rate limit", () => {
  it("blocks the sixth request in a fifteen-minute window", () => {
    const key = `test-${crypto.randomUUID()}`;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(checkBookingRateLimit(key, 1000).allowed).toBe(true);
    }
    expect(checkBookingRateLimit(key, 1000).allowed).toBe(false);
    expect(checkBookingRateLimit(key, 16 * 60 * 1000).allowed).toBe(true);
  });
});
