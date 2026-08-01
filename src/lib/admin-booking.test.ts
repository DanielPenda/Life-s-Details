import { describe, expect, it } from "vitest";
import { adminBookingUpdateSchema, brusselsLocalToUtc } from "./admin-booking";

describe("admin booking management", () => {
  it("requires an appointment for confirmation", () => {
    const result = adminBookingUpdateSchema.safeParse({ bookingId: "1", status: "CONFIRMED", appointmentDate: "", appointmentTime: "", estimatedPrice: null, finalPrice: null, paymentStatus: "UNPAID", paymentMethod: null, internalNotes: "", actionNote: "" });
    expect(result.success).toBe(false);
  });

  it("converts Brussels summer time to UTC", () => {
    expect(brusselsLocalToUtc("2026-08-10", "09:30")?.toISOString()).toBe("2026-08-10T07:30:00.000Z");
  });

  it("requires a method for paid bookings", () => {
    const result = adminBookingUpdateSchema.safeParse({ bookingId: "1", status: "COMPLETED", appointmentDate: "2026-08-10", appointmentTime: "09:30", estimatedPrice: 49, finalPrice: 55, paymentStatus: "PAID", paymentMethod: null, internalNotes: "", actionNote: "" });
    expect(result.success).toBe(false);
  });
});
