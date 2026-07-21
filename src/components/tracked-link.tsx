"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  trackEvent,
  type AnalyticsEventName,
  type AnalyticsProperties,
} from "@/lib/analytics";

type TrackedLinkProps = {
  href: string;
  event: AnalyticsEventName;
  eventProperties?: AnalyticsProperties;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  target?: "_blank";
};

export function TrackedLink({
  href,
  event,
  eventProperties,
  children,
  className,
  ariaLabel,
  target,
}: TrackedLinkProps) {
  const handleClick = () => trackEvent(event, eventProperties);
  const isInternal = href.startsWith("/") || href.startsWith("#");

  if (isInternal) {
    return (
      <Link
        aria-label={ariaLabel}
        className={className}
        href={href}
        onClick={handleClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      aria-label={ariaLabel}
      className={className}
      href={href}
      onClick={handleClick}
      rel={target === "_blank" ? "noreferrer" : undefined}
      target={target}
    >
      {children}
    </a>
  );
}
