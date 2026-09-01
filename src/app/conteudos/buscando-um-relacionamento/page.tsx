import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, HeartHandshake, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ArticleCard } from "@/components/article-card";
import { articleCategory, articles } from "@/content/articles";

export const metadata: Metadata = {
  title: "Buscando um relacionamento",
  description:
    "Dez artigos para mulheres que desejam reconhecer intenção, compatibilidade, disponibilidade e reciprocidade em uma relação séria.",
  alternates: {
    canonical: "/conteudos/buscando-um-relacionamento",
  },
  openGraph: {
    title: "Buscando um relacionamento | AMARIA",
    description: articleCategory.description,
    url: "/conteudos/buscando-um-relacionamento",
  },
};

export default function RelationshipCategoryPage() {
  return (
    <AppShell>
      <div className="catalog-page">
        <nav className="article-breadcrumbs" aria-label="Caminho da página">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href="/conteudos">Conteúdos</Link>
          <span aria-hidden="true">/</span>
          <span>{articleCategory.name}</span>
        </nav>

        <header className="category-hero">
          <span className="category-hero-icon">
            <HeartHandshake aria-hidden="true" />
          </span>
          <p className="eyebrow">
            <Sparkles size={13} aria-hidden="true" /> PRIMEIRA COLEÇÃO EDITORIAL
          </p>
          <h1>{articleCategory.name}</h1>
          <p>{articleCategory.description}</p>
          <div className="category-hero-actions">
            <span>{articles.length} artigos · leitura pública</span>
            <Link href="/buscar">
              <Search size={16} /> Buscar nesta coleção
            </Link>
          </div>
        </header>

        <section className="catalog-list" aria-labelledby="collection-title">
          <div className="catalog-section-heading">
            <div>
              <span>DA CLAREZA À CONSTRUÇÃO</span>
              <h2 id="collection-title">Siga no seu ritmo</h2>
            </div>
            <Link href="/conteudos" className="back-link compact-back">
              <ArrowLeft size={15} /> Todo o acervo
            </Link>
          </div>
          <div className="article-card-grid">
            {articles.map((article, index) => (
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
