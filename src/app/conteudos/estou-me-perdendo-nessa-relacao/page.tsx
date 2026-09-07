import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ArticleCard } from "@/components/article-card";
import { PageHero } from "@/components/page-hero";
import { selfLossArticleCategory } from "@/content/articles";
import { getPublishedArticles } from "@/lib/articles-server";

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

export const dynamic = "force-dynamic";

export default async function SelfLossCategoryPage() {
  const categoryArticles = (await getPublishedArticles()).filter(
    (article) => article.categorySlug === selfLossArticleCategory.slug,
  );
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

        <PageHero
          eyebrow="NOVA JORNADA EDITORIAL"
          title={selfLossArticleCategory.name}
          description={selfLossArticleCategory.description}
          image="/articles/relacionamento-toxico-sinais-de-autoabandono-2026.webp"
          imageAlt="Mulher contemplativa refletindo sobre seu relacionamento"
        >
          <div className="category-hero-actions">
            <span>
              {categoryArticles.length}{" "}
              {categoryArticles.length === 1 ? "artigo" : "artigos"} · leitura
              com prévia pública
            </span>
            <Link href="/buscar">
              <Search size={16} /> Buscar nesta jornada
            </Link>
          </div>
        </PageHero>

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
