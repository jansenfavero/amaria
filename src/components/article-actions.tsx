"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Heart, MessageCircle, Share2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type ArticleActionsProps = {
  slug: string;
  title: string;
  compact?: boolean;
  isMember?: boolean;
};

type LikeState = { liked: boolean; count: number };

export function ArticleActions({
  slug,
  title,
  compact = false,
  isMember = false,
}: ArticleActionsProps) {
  const [like, setLike] = useState<LikeState>({ liked: false, count: 0 });
  const [likePending, setLikePending] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    void fetch(`/api/interactions?slug=${encodeURIComponent(slug)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: LikeState | null) => {
        if (active && data) {
          setLike({
            liked: data.liked === true,
            count: Number(data.count) || 0,
          });
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [slug]);

  async function toggleLike() {
    if (likePending) return;
    setLikePending(true);
    try {
      const response = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_like", slug }),
      });
      if (response.ok) {
        const data = (await response.json()) as LikeState;
        setLike({ liked: data.liked === true, count: Number(data.count) || 0 });
        trackEvent("article_like", { slug, liked: data.liked === true });
      }
    } finally {
      setLikePending(false);
    }
  }

  async function share() {
    const url = `${window.location.origin}/conteudos/${slug}`;
    trackEvent("article_share", { slug });
    void fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName: "article_share",
        path: `/conteudos/${slug}`,
        slug,
      }),
    });

    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} | AMARIA`, url });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt("Copie o endereço desta reflexão:", url);
    }
  }

  return (
    <div className={compact ? "article-actions compact" : "article-actions"}>
      <button
        type="button"
        className={like.liked ? "is-liked" : ""}
        aria-pressed={like.liked}
        aria-label={`${like.liked ? "Remover curtida de" : "Curtir"} ${title}`}
        onClick={() => void toggleLike()}
        disabled={likePending}
      >
        <Heart fill={like.liked ? "currentColor" : "none"} aria-hidden="true" />
        <span>{like.liked ? "Curtido" : "Curtir"}</span>
        {like.count > 0 ? <small>{like.count}</small> : null}
      </button>
      <Link
        href={`/conteudos/${slug}#comentarios`}
        aria-label={
          isMember
            ? `Comentar em ${title}`
            : `Acessar a área de comentários de ${title}`
        }
      >
        <MessageCircle aria-hidden="true" />
        <span>Comentar</span>
      </Link>
      <button
        type="button"
        aria-label={`Compartilhar ${title}`}
        onClick={() => void share()}
      >
        {copied ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
        <span>{copied ? "Link copiado" : "Compartilhar"}</span>
      </button>
      <span className="sr-status" aria-live="polite">
        {copied ? "Link copiado para a área de transferência." : ""}
      </span>
    </div>
  );
}

