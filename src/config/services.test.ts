import { describe, expect, it } from "vitest";
import { services } from "@/config/services";

describe("Phase 1 service configuration", () => {
  it("exposes exactly three complete landing-page packages", () => {
    expect(services).toHaveLength(3);

    for (const service of services) {
      expect(service.inclusions.length).toBeGreaterThanOrEqual(4);
      expect(service.duration).toBeTruthy();
      expect(service.priceLabel).toBeTruthy();
      expect(service.bestFor).toBeTruthy();
    }
  });
});
