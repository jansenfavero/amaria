import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Compass,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { RightRail } from "@/components/app-shell";
import { SmartContentSearch } from "@/components/smart-content-search";
import { getPublishedArticles } from "@/lib/articles-server";
import styles from "./smart-content-search.module.css";

const topicCards = [
  {
    href: "/conteudos/buscando-um-relacionamento",
    title: "Buscando um relacionamento",
    caption: "Clareza para escolher e construir.",
    icon: HeartHandshake,
    className: "tone-rose",
    image: "/editorial/relacionamentos.webp",
  },
  {
    href: "/conteudos/estou-me-perdendo-nessa-relacao",
    title: "Estou me perdendo nessa relação",
    caption: "Sinais, limites e reconexão consigo.",
    icon: ShieldCheck,
    className: "tone-lilac",
    image: "/articles/relacionamento-toxico-sinais-de-autoabandono-2026.webp",
  },
  {
    href: "/curadoria",
    title: "Nossa curadoria",
    caption: "Psicologia, cuidado e responsabilidade.",
    icon: Compass,
    className: "tone-sand",
    image: "/editorial/amor-proprio.webp",
  },
] as const;

export async function Feed() {
  const publishedArticles = await getPublishedArticles();
  const searchArticles = publishedArticles.map(
    ({ slug, href, title, excerpt, category, keywords }) => ({
      slug,
      href,
      title,
      excerpt,
      category,
      keywords,
    }),
  );

  return (
    <div className="content-grid" id="inicio">
      <div className="feed-column">
        <SmartContentSearch articles={searchArticles} />

        <section
          className="topics-section"
          id="temas"
          aria-labelledby="topics-title"
        >
          <div className="section-heading">
            <h2 id="topics-title">O que faz sentido para você hoje?</h2>
            <span>EXPLORE</span>
          </div>
          <div className={`topic-grid ${styles.topicsThreeUp}`}>
            {topicCards.map(
              ({ href, title, caption, icon: Icon, className, image }) => (
                <Link
                  href={href}
                  key={href}
                  className={`topic-card ${className}`}
                >
                  <Image
                    className="topic-card-image"
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width: 760px) calc(100vw - 64px), 220px"
                  />
                  <span className="topic-card-overlay" aria-hidden="true" />
                  <span className="topic-icon">
                    <Icon size={22} strokeWidth={1.35} aria-hidden="true" />
                  </span>
                  <strong>{title}</strong>
                  <span>{caption}</span>
                  <ArrowRight
                    className="topic-arrow"
                    size={14}
                    aria-hidden="true"
                  />
                </Link>
              ),
            )}
          </div>
        </section>

        <div className="feed-toolbar editorial-feed-heading">
          <div>
            <span className="eyebrow">ACERVO EDITORIAL</span>
            <h2>Leituras para diferentes momentos</h2>
          </div>
          <Link href="/conteudos">Ver acervo</Link>
        </div>

        <p className="feed-disclosure">
          {publishedArticles.length} leituras · 20% abertas para conhecer ·
          acesso completo gratuito para membros
        </p>

        <div className="posts-list" aria-label="Artigos da AMARIA">
          {publishedArticles.map((article, index) => (
            <ArticleCard
              article={article}
              key={article.slug}
              preload={index === 0}
            />
          ))}
        </div>

        <div className="feed-end">
          <span>✦</span>
          <p>Por hoje, fique com o que fez sentido.</p>
          <Link href="/conteudos">
            Continue no acervo da AMARIA <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <RightRail />
    </div>
  );
}
