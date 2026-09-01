"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Sparkles, X } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import type { Article } from "@/content/articles/types";
import { trackEvent } from "@/lib/analytics";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function SearchExperience({
  articles,
  initialQuery,
}: {
  articles: Article[];
  initialQuery: string;
}) {
  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const normalizedQuery = normalize(query);

  const results = useMemo(() => {
    if (!normalizedQuery) return articles;
    return articles.filter((article) =>
      normalize(
        [
          article.title,
          article.subtitle,
          article.excerpt,
          article.category,
          ...article.keywords,
        ].join(" "),
      ).includes(normalizedQuery),
    );
  }, [articles, normalizedQuery]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = input.trim();
    setQuery(next);
    const url = next ? `/buscar?q=${encodeURIComponent(next)}` : "/buscar";
    window.history.replaceState({}, "", url);
    trackEvent("content_search", { query: next, results: results.length });
  }

  function clear() {
    setInput("");
    setQuery("");
    window.history.replaceState({}, "", "/buscar");
  }

  return (
    <div className="search-page">
      <Link href="/conteudos" className="back-link">
        <ArrowLeft size={16} /> Voltar aos conteúdos
      </Link>
      <header className="search-hero">
        <p className="eyebrow">
          <Sparkles size={13} /> ENCONTRE UMA REFLEXÃO
        </p>
        <h1>O que você deseja compreender hoje?</h1>
        <p>Busque por uma palavra, tema ou pergunta.</p>
        <form className="search-form" role="search" onSubmit={submit}>
          <Search aria-hidden="true" />
          <label className="visually-hidden" htmlFor="content-search">
            Buscar conteúdos
          </label>
          <input
            id="content-search"
            type="search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ex.: reciprocidade, intenção, paz..."
            autoComplete="off"
          />
          {input ? (
            <button type="button" className="search-clear" onClick={clear}>
              <X aria-hidden="true" />
              <span className="visually-hidden">Limpar busca</span>
            </button>
          ) : null}
          <button type="submit" className="button button-primary">
            Buscar
          </button>
        </form>
      </header>

      <section className="search-results" aria-live="polite">
        <div className="catalog-section-heading">
          <div>
            <span>{query ? "RESULTADO DA BUSCA" : "TODO O ACERVO"}</span>
            <h2>
              {query
                ? `${results.length} ${results.length === 1 ? "conteúdo encontrado" : "conteúdos encontrados"}`
                : "Comece por uma destas leituras"}
            </h2>
          </div>
          {query ? <p>“{query}”</p> : null}
        </div>

        {results.length ? (
          <div className="article-card-grid">
            {results.map((article, index) => (
              <ArticleCard
                article={article}
                key={article.slug}
                preload={index < 2}
                variant="grid"
              />
            ))}
          </div>
        ) : (
          <div className="search-empty">
            <Search aria-hidden="true" />
            <h2>Nenhuma leitura encontrada.</h2>
            <p>
              Tente uma palavra mais ampla, como “relacionamento”, “clareza” ou
              “reciprocidade”.
            </p>
            <button
              className="button button-primary"
              type="button"
              onClick={clear}
            >
              Ver todos os artigos
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
