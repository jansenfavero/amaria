"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Heart, MessageCircle, Share2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type ArticleActionsProps = {
  slug: string;
  title: string;
  compact?: boolean;
};

export function ArticleActions({
  slug,
  title,
  compact = false,
}: ArticleActionsProps) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setLiked(window.localStorage.getItem(`amaria:liked:${slug}`) === "true");
    });
    return () => window.cancelAnimationFrame(frame);
  }, [slug]);

  function toggleLike() {
    const next = !liked;
    setLiked(next);
    window.localStorage.setItem(`amaria:liked:${slug}`, String(next));
    trackEvent("article_like", { slug, liked: next });
  }

  async function share() {
    const url = `${window.location.origin}/conteudos/${slug}`;
    trackEvent("article_share", { slug });
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} | AMAR.IA`, url });
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
        className={liked ? "is-liked" : ""}
        aria-pressed={liked}
        aria-label={`${liked ? "Remover curtida de" : "Curtir"} ${title}`}
        onClick={toggleLike}
      >
        <Heart fill={liked ? "currentColor" : "none"} aria-hidden="true" />
        <span>{liked ? "Curtido" : "Curtir"}</span>
      </button>
      <Link
        href="/comunidade"
        aria-label={`Conheça o futuro espaço de comentários para ${title}`}
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
