import { describe, expect, it, vi } from "vitest";
import {
  analyticsEvents,
  trackEvent,
  type AnalyticsPayload,
} from "@/lib/analytics";

describe("analytics abstraction", () => {
  it("dispatches a typed first-party event", () => {
    const listener = vi.fn<(event: Event) => void>();
    window.addEventListener("lifesdetails:analytics", listener);

    trackEvent(analyticsEvents.serviceCardClick, { service: "refresh" });

    expect(listener).toHaveBeenCalledOnce();
    const event = listener.mock.calls[0][0] as CustomEvent<AnalyticsPayload>;
    expect(event.detail.name).toBe("service_card_click");
    expect(event.detail.properties).toEqual({ service: "refresh" });
    expect(event.detail.timestamp).toBeTruthy();

    window.removeEventListener("lifesdetails:analytics", listener);
  });
});
