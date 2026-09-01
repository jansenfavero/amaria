import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Flower2,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { RightRail } from "@/components/app-shell";
import { SmartContentSearch } from "@/components/smart-content-search";
import { articles } from "@/content/articles";
import styles from "./smart-content-search.module.css";

const topicCards = [
  {
    href: "/conteudos/buscando-um-relacionamento",
    title: "Buscando um relacionamento",
    caption: "Clareza para escolher e construir.",
    icon: HeartHandshake,
    className: "tone-rose",
  },
  {
    href: "/conteudos/estou-me-perdendo-nessa-relacao",
    title: "Estou me perdendo nessa relação",
    caption: "Sinais, limites e reconexão consigo.",
    icon: ShieldCheck,
    className: "tone-lilac",
  },
  {
    href: "/curadoria",
    title: "Nossa curadoria",
    caption: "Psicologia, cuidado e responsabilidade.",
    icon: Compass,
    className: "tone-sand",
  },
] as const;

export function Feed() {
  const searchArticles = articles.map(
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
        <section className="feed-welcome">
          <div>
            <p className="eyebrow">
              <Sparkles size={13} aria-hidden="true" /> BEM-VINDA AO SEU ESPAÇO
            </p>
            <h1>
              Mais perto <em>de você.</em>
            </h1>
            <p>
              Conteúdo para escolher com clareza, se relacionar com presença e
              continuar inteira.
            </p>
          </div>
          <span className="welcome-flower" aria-hidden="true">
            <Flower2 size={48} strokeWidth={1} />
          </span>
        </section>

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
              ({ href, title, caption, icon: Icon, className }) => (
                <Link
                  href={href}
                  key={href}
                  className={`topic-card ${className}`}
                >
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
          {articles.length} leituras públicas · curadoria psicológica · acesso
          livre, sem login
        </p>

        <div className="posts-list" aria-label="Artigos da AMARIA">
          {articles.map((article, index) => (
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
