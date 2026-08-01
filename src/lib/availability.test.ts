import { describe, expect, it } from "vitest";
import { deriveTimeWindow, minutesToTime, timeToMinutes } from "./availability";

describe("availability helpers", () => {
  it("converts schedule times without losing minutes", () => {
    expect(timeToMinutes("12:30")).toBe(750);
    expect(minutesToTime(750)).toBe("12:30");
  });

  it("derives the legacy reporting window from an exact start time", () => {
    expect(deriveTimeWindow("09:00")).toBe("MORNING");
    expect(deriveTimeWindow("14:00")).toBe("AFTERNOON");
    expect(deriveTimeWindow("18:00")).toBe("EVENING");
  });
});
