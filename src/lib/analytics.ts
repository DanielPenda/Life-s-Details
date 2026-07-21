export const analyticsEvents = {
  heroBookingClick: "hero_booking_click",
  serviceCardClick: "service_card_click",
  whatsappClick: "whatsapp_click",
  contactClick: "contact_click",
  beforeAfterInteraction: "before_after_interaction",
  bookingPageVisit: "booking_page_visit",
} as const;

export type AnalyticsEventName =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | undefined
>;

export type AnalyticsPayload = {
  name: AnalyticsEventName;
  properties: AnalyticsProperties;
  timestamp: string;
};

export function trackEvent(
  name: AnalyticsEventName,
  properties: AnalyticsProperties = {},
) {
  const payload: AnalyticsPayload = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    console.info("[Life's Details analytics]", payload);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<AnalyticsPayload>("lifesdetails:analytics", {
        detail: payload,
      }),
    );
  }
}
