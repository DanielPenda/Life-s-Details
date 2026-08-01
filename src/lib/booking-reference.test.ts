import { describe, expect, it } from "vitest";
import { createBookingReference, hashBookingAccessToken } from "./booking-reference";

describe("booking reference helpers", () => {
  it("creates a non-database public reference", () => {
    expect(createBookingReference(new Date("2026-08-01T00:00:00Z"))).toMatch(/^LD-2026-[A-F0-9]{6}$/);
  });

  it("hashes access tokens consistently without storing the raw token", () => {
    expect(hashBookingAccessToken("token")).toBe(hashBookingAccessToken("token"));
    expect(hashBookingAccessToken("token")).not.toContain("token");
  });
});
