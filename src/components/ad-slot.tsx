"use client";

import { useEffect } from "react";

type Placement = "article-top" | "article-middle" | "article-end";

declare global {
  interface Window {
    adsbygoogle?: Record<string, never>[];
  }
}

const slots: Record<Placement, string | undefined> = {
  "article-top": process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_TOP_SLOT,
  "article-middle": process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_MIDDLE_SLOT,
  "article-end": process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_END_SLOT,
};

export function AdSlot({ placement }: { placement: Placement }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slot = slots[placement];
  const active = Boolean(client && slot);

  useEffect(() => {
    if (!active) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // O provedor controla novas tentativas; a leitura nunca deve ser afetada.
    }
  }, [active]);

  if (!active) {
    return (
      <aside className="ad-slot is-reserved" aria-label="Espaço publicitário">
        <span>Publicidade</span>
      </aside>
    );
  }

  return (
    <aside className="ad-slot" aria-label="Publicidade">
      <span>Publicidade</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
