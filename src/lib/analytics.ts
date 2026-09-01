"use client";

type AnalyticsValue = string | number | boolean;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      properties?: Record<string, AnalyticsValue>,
    ) => void;
  }
}

export function trackEvent(
  eventName: string,
  properties: Record<string, AnalyticsValue> = {},
) {
  window.dispatchEvent(
    new CustomEvent("amaria:analytics", {
      detail: { eventName, properties },
    }),
  );
  window.gtag?.("event", eventName, properties);
}
