import { describe, expect, it } from "vitest";
import { businessInfo, contactLinks } from "./business";

describe("business contact configuration", () => {
  it("keeps phone and WhatsApp links mobile friendly", () => {
    expect(businessInfo.phone.display).toBe("+32 491 64 57 00");
    expect(contactLinks.phone).toBe("tel:+32491645700");
    expect(contactLinks.whatsapp).toContain("https://wa.me/32491645700");
  });

  it("uses the direct business email address", () => {
    expect(contactLinks.email).toBe("mailto:info.lifesdetails@gmail.com");
  });
});
