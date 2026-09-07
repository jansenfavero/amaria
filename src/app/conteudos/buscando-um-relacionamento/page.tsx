import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ArticleCard } from "@/components/article-card";
import { PageHero } from "@/components/page-hero";
import { articleCategory } from "@/content/articles";
import { getPublishedArticles } from "@/lib/articles-server";

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

export const dynamic = "force-dynamic";

export default async function RelationshipCategoryPage() {
  const categoryArticles = (await getPublishedArticles()).filter(
    (article) => article.categorySlug === articleCategory.slug,
  );
  return (
    <AppShell>
      <div className="catalog-page">
        <PageHero
          backHref="/conteudos"
          backLabel="Voltar aos conteúdos"
          eyebrow="PRIMEIRA COLEÇÃO EDITORIAL"
          title={articleCategory.name}
          description={articleCategory.description}
          image="/editorial/relacionamentos.webp"
          imageAlt="Mulheres conversando em um ambiente acolhedor"
        >
          <div className="category-hero-actions">
            <span>{categoryArticles.length} artigos · prévia pública</span>
            <Link href="/buscar">
              <Search size={16} /> Buscar nesta coleção
            </Link>
          </div>
        </PageHero>

        <section className="catalog-list" aria-labelledby="collection-title">
          <div className="catalog-section-heading">
            <div>
              <span>DA CLAREZA À CONSTRUÇÃO</span>
              <h2 id="collection-title">Siga no seu ritmo</h2>
            </div>
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
