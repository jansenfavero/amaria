import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { ArticleActions } from "@/components/article-actions";
import type { Article } from "@/content/articles/types";

export function ArticleCard({
  article,
  preload = false,
  variant = "feed",
}: {
  article: Article;
  preload?: boolean;
  variant?: "feed" | "grid";
}) {
  return (
    <article
      className={`post-card editorial-card ${variant === "grid" ? "grid-card" : ""}`}
      aria-labelledby={`${article.slug}-card-title`}
    >
      <header className="post-header">
        <Image
          className="editorial-avatar"
          src="/brand/emblem.webp"
          alt=""
          width={40}
          height={40}
        />
        <div>
          <strong>
            AMARIA <span className="editorial-star">✦</span>
          </strong>
          <span>Conteúdo de inteligência relacional</span>
        </div>
        <Link
          className="post-topic tone-rose"
          href={`/conteudos/${article.categorySlug}`}
        >
          {article.category}
        </Link>
      </header>

      <Link
        href={article.href}
        className="post-visual editorial-card-visual"
        aria-label={`Ler ${article.title}`}
      >
        <Image
          src={article.hero.src}
          alt={article.hero.alt}
          fill
          sizes={
            variant === "grid"
              ? "(max-width: 760px) calc(100vw - 64px), 420px"
              : "(max-width: 760px) calc(100vw - 56px), (max-width: 1180px) 700px, 660px"
          }
          preload={preload}
          className="post-photo"
        />
        <span className="post-image-action">
          <span>
            Ler artigo <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </span>
      </Link>

      <div className="post-body">
        <p className="post-kicker">
          <Clock3 size={13} aria-hidden="true" /> {article.readingMinutes} min
          de leitura
        </p>
        <h2 id={`${article.slug}-card-title`}>
          <Link href={article.href}>{article.title}</Link>
        </h2>
        <p className="post-excerpt">{article.excerpt}</p>
        <Link href={article.href} className="read-link">
          Continuar a leitura <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <ArticleActions slug={article.slug} title={article.title} compact />
    </article>
  );
}
