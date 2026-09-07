import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Heart, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ArticleCard } from "@/components/article-card";
import { PageHero } from "@/components/page-hero";
import {
  articleCategories,
  getArticlesByCategory,
} from "@/content/articles";
import { getPublishedArticles } from "@/lib/articles-server";

const futureJourneys = [
  "Estou conhecendo alguém",
  "Não sei o que somos",
  "Estou em um relacionamento",
  "Terminou",
  "Quero recomeçar",
] as const;

export const metadata: Metadata = {
  title: "Conteúdos sobre relacionamentos",
  description:
    "Acesse o acervo público da AMARIA com reflexões sobre escolhas, reciprocidade, autonomia, limites e relacionamentos mais conscientes.",
  alternates: { canonical: "/conteudos" },
  openGraph: {
    title: "Conteúdos sobre relacionamentos | AMARIA",
    description:
      "Reflexões cuidadosas para escolher, se relacionar e continuar inteira.",
    url: "/conteudos",
  },
};

export const dynamic = "force-dynamic";

export default async function ContentsPage() {
  const publishedArticles = await getPublishedArticles();
  return (
    <AppShell>
      <div className="catalog-page">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} aria-hidden="true" /> Voltar ao início
        </Link>
        <PageHero
          eyebrow="ACERVO AMARIA"
          title="Conteúdos para relações mais conscientes."
          description="Conheça 20% de cada leitura sem login. Membros gratuitas acessam o conteúdo completo e participam das conversas."
          image="/editorial/relacionamentos.webp"
          imageAlt="Mulheres conversando com presença e acolhimento"
        />

        {articleCategories.map((category) => {
          const categoryArticles = getArticlesByCategory(category.slug);
          return (
            <section className="catalog-category-card" key={category.slug}>
              <div>
                <span>
                  COLEÇÃO · {categoryArticles.length}{" "}
                  {categoryArticles.length === 1 ? "ARTIGO" : "ARTIGOS"}
                </span>
                <h2>{category.name}</h2>
                <p>{category.description}</p>
              </div>
              <div className="catalog-actions">
                <Link
                  href={`/conteudos/${category.slug}`}
                  className="button button-primary"
                >
                  Ver coleção
                </Link>
                <Link href="/buscar" className="button button-secondary">
                  <Search size={16} /> Buscar
                </Link>
              </div>
            </section>
          );
        })}

        <section className="catalog-list" aria-labelledby="catalog-title">
          <div className="catalog-section-heading">
            <div>
              <span>PUBLICADOS</span>
              <h2 id="catalog-title">Todas as leituras</h2>
            </div>
            <p>{publishedArticles.length} artigos · perfil gratuito</p>
          </div>
          <div className="article-card-grid">
            {publishedArticles.map((article, index) => (
              <ArticleCard
                article={article}
                key={article.slug}
                preload={index < 2}
                variant="grid"
              />
            ))}
          </div>
        </section>

        <section
          className="future-journeys"
          aria-labelledby="proximas-jornadas"
        >
          <div className="catalog-section-heading">
            <div>
              <span>EM DESENVOLVIMENTO</span>
              <h2 id="proximas-jornadas">Próximas jornadas</h2>
            </div>
            <p>Novos caminhos para diferentes momentos da sua história.</p>
          </div>
          <div className="future-journey-grid">
            {futureJourneys.map((journey) => (
              <article key={journey} className="future-journey-card">
                <span aria-hidden="true">
                  <Heart size={18} />
                </span>
                <h3>{journey}</h3>
                <p>Em breve</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
