"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { useTranslations } from "@/i18n/locale-provider";

export function BeforeAfterComparison() {
  const t = useTranslations();
  const [position, setPosition] = useState(52);
  const rangeInteractionTracked = useRef(false);

  const trackInteraction = (method: "drag" | "keyboard" | "tap") => {
    if (method !== "drag" || !rangeInteractionTracked.current) {
      trackEvent(analyticsEvents.beforeAfterInteraction, { method });
    }
    if (method === "drag") rangeInteractionTracked.current = true;
  };

  return (
    <div className="comparison-shell">
      <div
        className="comparison-visual"
        style={{ "--comparison-position": `${position}%` } as CSSProperties}
      >
        <Image
          alt={t("comparison.alt")}
          className="comparison-image"
          fill
          sizes="(min-width: 900px) 760px, 100vw"
          src="/images/comparison-placeholder.jpg"
        />
        <div className="comparison-before" aria-hidden="true">
          <Image
            alt=""
            className="comparison-image comparison-image-before"
            fill
            sizes="(min-width: 900px) 760px, 100vw"
            src="/images/comparison-placeholder.jpg"
          />
        </div>
        <span className="comparison-label comparison-label-before">{t("comparison.before")}</span>
        <span className="comparison-label comparison-label-after">{t("comparison.after")}</span>
        <span className="comparison-divider" aria-hidden="true">
          <span className="comparison-handle">&#8596;</span>
        </span>
        <input
          aria-label={t("comparison.aria")}
          className="comparison-range"
          max="100"
          min="0"
          onChange={(event) => setPosition(Number(event.target.value))}
          onKeyDown={(event) => {
            const nextPosition = {
              ArrowDown: Math.max(0, position - 1),
              ArrowLeft: Math.max(0, position - 1),
              ArrowRight: Math.min(100, position + 1),
              ArrowUp: Math.min(100, position + 1),
              End: 100,
              Home: 0,
            }[event.key];

            if (nextPosition !== undefined) {
              event.preventDefault();
              setPosition(nextPosition);
              trackInteraction("keyboard");
            }
          }}
          onPointerDown={() => trackInteraction("drag")}
          type="range"
          value={position}
        />
      </div>
      <div className="comparison-controls" aria-label={t("comparison.controls")}>
        <button
          className="comparison-control"
          onClick={() => {
            setPosition(100);
            trackInteraction("tap");
          }}
          type="button"
        >
          {t("comparison.showBefore")}
        </button>
        <button
          className="comparison-control"
          onClick={() => {
            setPosition(0);
            trackInteraction("tap");
          }}
          type="button"
        >
          {t("comparison.showAfter")}
        </button>
      </div>
    </div>
  );
}
