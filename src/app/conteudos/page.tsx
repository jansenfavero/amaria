import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpenText, Heart, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ArticleCard } from "@/components/article-card";
import { articleCategory, articles } from "@/content/articles";

const futureJourneys = [
  "Estou conhecendo alguém",
  "Não sei o que somos",
  "Estou em um relacionamento",
  "Estou me perdendo nessa relação",
  "Terminou",
  "Quero recomeçar",
] as const;

export const metadata: Metadata = {
  title: "Conteúdos sobre relacionamentos",
  description:
    "Acesse o acervo público da AMARIA com reflexões sobre escolhas, reciprocidade, compatibilidade e relacionamentos sérios.",
  alternates: { canonical: "/conteudos" },
  openGraph: {
    title: "Conteúdos sobre relacionamentos | AMARIA",
    description:
      "Reflexões cuidadosas para escolher, se relacionar e continuar inteira.",
    url: "/conteudos",
  },
};

export default function ContentsPage() {
  return (
    <AppShell>
      <div className="catalog-page">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} aria-hidden="true" /> Voltar ao início
        </Link>
        <header className="catalog-hero">
          <div>
            <p className="eyebrow">
              <Sparkles size={13} aria-hidden="true" /> ACERVO AMARIA
            </p>
            <h1>Conteúdos para relações mais conscientes.</h1>
            <p>
              Leituras públicas, sem login, para transformar dúvidas em boas
              perguntas e escolhas mais claras.
            </p>
          </div>
          <BookOpenText aria-hidden="true" />
        </header>

        <section className="catalog-category-card">
          <div>
            <span>PRIMEIRA COLEÇÃO · {articles.length} ARTIGOS</span>
            <h2>{articleCategory.name}</h2>
            <p>{articleCategory.description}</p>
          </div>
          <div className="catalog-actions">
            <Link
              href={`/conteudos/${articleCategory.slug}`}
              className="button button-primary"
            >
              Ver coleção
            </Link>
            <Link href="/buscar" className="button button-secondary">
              <Search size={16} /> Buscar
            </Link>
          </div>
        </section>

        <section className="catalog-list" aria-labelledby="catalog-title">
          <div className="catalog-section-heading">
            <div>
              <span>PUBLICADOS</span>
              <h2 id="catalog-title">Todas as leituras</h2>
            </div>
            <p>{articles.length} artigos · acesso livre</p>
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
