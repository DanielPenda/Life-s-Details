import { describe, expect, it } from "vitest";
import { bookingRequestSchema } from "./booking-schema";

const validRequest = {
  serviceSlug: "refresh",
  addOnSlugs: [],
  vehicleType: "medium-car",
  vehicleMake: "Volkswagen",
  vehicleModel: "Golf",
  vehicleColour: "Blue",
  licencePlateOptional: "",
  vehicleCondition: "MODERATE",
  hasPetHair: false,
  hasStains: false,
  hasStrongOdour: false,
  conditionNotes: "",
  addressLine: "Stationstraat 1",
  postcode: "9880",
  city: "Aalter",
  serviceLocationType: "HOME",
  accessToWater: true,
  accessToElectricity: true,
  preferredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  appointmentTime: "09:30",
  customerName: "Daniel Penda",
  phone: "+32 491 64 57 00",
  email: "customer@example.com",
  preferredContactMethod: "WHATSAPP",
  paymentMethodPreference: "CASH",
  acquisitionSource: "Google",
  customerConsent: true,
  marketingConsent: false,
  idempotencyKey: "45f6851b-e2c7-4bf1-a882-cdaea26b9c5f",
  website: "",
} as const;

describe("bookingRequestSchema", () => {
  it("accepts a complete request", () => {
    expect(bookingRequestSchema.safeParse(validRequest).success).toBe(true);
  });

  it("rejects missing operational consent", () => {
    const result = bookingRequestSchema.safeParse({ ...validRequest, customerConsent: false });
    expect(result.success).toBe(false);
  });

  it("rejects the honeypot and invalid Belgian postcode", () => {
    const result = bookingRequestSchema.safeParse({ ...validRequest, postcode: "988", website: "spam" });
    expect(result.success).toBe(false);
  });

  it("rejects dates in the past", () => {
    const result = bookingRequestSchema.safeParse({ ...validRequest, preferredDate: "2020-01-01" });
    expect(result.success).toBe(false);
  });
});
