import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Compass,
  Flower2,
  HeartHandshake,
  Search,
  Sparkles,
} from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { RightRail } from "@/components/app-shell";
import { articles } from "@/content/articles";

const topicCards = [
  {
    href: "/conteudos/buscando-um-relacionamento",
    title: "Buscando um relacionamento",
    caption: "Clareza para escolher e construir.",
    icon: HeartHandshake,
    className: "tone-rose",
  },
  {
    href: "/conteudos",
    title: "Todos os conteúdos",
    caption: "Conheça a primeira coleção editorial.",
    icon: BookOpenText,
    className: "tone-lilac",
  },
  {
    href: "/buscar",
    title: "Buscar uma reflexão",
    caption: "Encontre um tema, palavra ou pergunta.",
    icon: Search,
    className: "tone-sage",
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

        <section
          className="topics-section"
          id="temas"
          aria-labelledby="topics-title"
        >
          <div className="section-heading">
            <h2 id="topics-title">O que faz sentido para você hoje?</h2>
            <span>EXPLORE</span>
          </div>
          <div className="topic-grid">
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
            <span className="eyebrow">PRIMEIRA COLEÇÃO EDITORIAL</span>
            <h2>Buscando um relacionamento</h2>
          </div>
          <Link href="/conteudos">Ver acervo</Link>
        </div>

        <p className="feed-disclosure">
          Dez leituras públicas · curadoria psicológica · acesso livre, sem
          login
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
