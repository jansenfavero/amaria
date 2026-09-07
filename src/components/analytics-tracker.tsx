"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    const match = pathname.match(/^\/conteudos\/([^/]+)$/);
    const categoryPaths = new Set([
      "buscando-um-relacionamento",
      "estou-me-perdendo-nessa-relacao",
    ]);
    const slug = match && !categoryPaths.has(match[1]) ? match[1] : null;
    const eventName = slug ? "article_view" : "page_view";
    void fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        path: pathname,
        slug,
      }),
    });
  }, [pathname]);

  return null;
}

