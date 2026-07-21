"use client";

import { useEffect } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

export function BookingVisitTracker() {
  useEffect(() => {
    trackEvent(analyticsEvents.bookingPageVisit);
  }, []);

  return null;
}
