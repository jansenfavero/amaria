import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Search, ShieldCheck, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ArticleCard } from "@/components/article-card";
import {
  getArticlesByCategory,
  selfLossArticleCategory,
} from "@/content/articles";

const categoryArticles = getArticlesByCategory(selfLossArticleCategory.slug);

export const metadata: Metadata = {
  title: "Estou me perdendo nessa relação",
  description:
    "Conteúdos para reconhecer controle, isolamento, autoabandono e perda de identidade, com atenção à autonomia e à segurança.",
  alternates: {
    canonical: "/conteudos/estou-me-perdendo-nessa-relacao",
  },
  openGraph: {
    title: "Estou me perdendo nessa relação | AMARIA",
    description: selfLossArticleCategory.description,
    url: "/conteudos/estou-me-perdendo-nessa-relacao",
  },
};

export default function SelfLossCategoryPage() {
  return (
    <AppShell>
      <div className="catalog-page">
        <nav className="article-breadcrumbs" aria-label="Caminho da página">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href="/conteudos">Conteúdos</Link>
          <span aria-hidden="true">/</span>
          <span>{selfLossArticleCategory.name}</span>
        </nav>

        <header className="category-hero">
          <span className="category-hero-icon">
            <ShieldCheck aria-hidden="true" />
          </span>
          <p className="eyebrow">
            <Sparkles size={13} aria-hidden="true" /> NOVA JORNADA EDITORIAL
          </p>
          <h1>{selfLossArticleCategory.name}</h1>
          <p>{selfLossArticleCategory.description}</p>
          <div className="category-hero-actions">
            <span>
              {categoryArticles.length}{" "}
              {categoryArticles.length === 1 ? "artigo" : "artigos"} · leitura
              pública
            </span>
            <Link href="/buscar">
              <Search size={16} /> Buscar nesta jornada
            </Link>
          </div>
        </header>

        <section className="catalog-list" aria-labelledby="collection-title">
          <div className="catalog-section-heading">
            <div>
              <span>DA PERCEPÇÃO À RECONEXÃO</span>
              <h2 id="collection-title">Volte a se escutar</h2>
            </div>
            <Link href="/conteudos" className="back-link compact-back">
              <ArrowLeft size={15} /> Todo o acervo
            </Link>
          </div>
          <div className="article-card-grid">
            {categoryArticles.map((article, index) => (
              <ArticleCard
                article={article}
                key={article.slug}
                preload={index < 2}
                variant="grid"
              />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
