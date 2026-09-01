"use client";

import { useMemo, useState, type FocusEvent } from "react";
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import type { Article } from "@/content/articles/types";
import styles from "./smart-content-search.module.css";

export type SearchArticlePreview = Pick<
  Article,
  "slug" | "href" | "title" | "excerpt" | "category" | "keywords"
>;

const quickSearches = [
  "Relacionamento tóxico",
  "Reciprocidade",
  "Ciúme",
  "Limites",
] as const;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function scoreArticle(article: SearchArticlePreview, query: string) {
  const normalizedQuery = normalize(query);
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  if (!terms.length) return 0;

  const title = normalize(article.title);
  const category = normalize(article.category);
  const keywords = normalize(article.keywords.join(" "));
  const excerpt = normalize(article.excerpt);

  let score = title.includes(normalizedQuery) ? 12 : 0;
  score += keywords.includes(normalizedQuery) ? 8 : 0;
  score += category.includes(normalizedQuery) ? 6 : 0;
  score += excerpt.includes(normalizedQuery) ? 3 : 0;

  for (const term of terms) {
    const matched =
      title.includes(term) ||
      keywords.includes(term) ||
      category.includes(term) ||
      excerpt.includes(term);

    if (!matched) return 0;
    if (title.includes(term)) score += 5;
    if (keywords.includes(term)) score += 3;
    if (category.includes(term)) score += 2;
    if (excerpt.includes(term)) score += 1;
  }

  return score;
}

export function SmartContentSearch({
  articles,
}: {
  articles: SearchArticlePreview[];
}) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const suggestions = useMemo(() => {
    if (normalize(query).length < 2) return [];

    return articles
      .map((article) => ({ article, score: scoreArticle(article, query) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ article }) => article);
  }, [articles, query]);

  function closeWhenFocusLeaves(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setExpanded(false);
    }
  }

  function chooseQuickSearch(value: string) {
    setQuery(value);
    setExpanded(true);
  }

  const showResults = expanded && normalize(query).length >= 2;

  return (
    <section className={styles.searchPanel} aria-labelledby="smart-search-title">
      <span className={styles.glow} aria-hidden="true" />
      <div className={styles.heading}>
        <p className={styles.eyebrow}>
          <Sparkles size={14} aria-hidden="true" /> BUSCA EDITORIAL INTELIGENTE
        </p>
        <h2 id="smart-search-title">
          Encontre a leitura que conversa com <em>o seu momento.</em>
        </h2>
        <p>
          Descreva uma dúvida, um sentimento ou uma situação. A AMARIA aproxima
          os conteúdos mais relevantes para você.
        </p>
      </div>

      <div className={styles.searchArea} onBlur={closeWhenFocusLeaves}>
        <form className={styles.searchForm} action="/buscar" role="search">
          <Search size={21} aria-hidden="true" />
          <label className={styles.visuallyHidden} htmlFor="smart-content-search">
            Buscar no acervo da AMARIA
          </label>
          <input
            id="smart-content-search"
            name="q"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setExpanded(true);
            }}
            onFocus={() => setExpanded(true)}
            placeholder="Ex.: ciúme, limites, reciprocidade..."
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-controls="smart-search-results"
            aria-expanded={showResults}
          />
          <button type="submit" aria-label="Buscar no acervo">
            <span>Buscar</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>

        {showResults ? (
          <div
            className={styles.suggestions}
            id="smart-search-results"
            role="listbox"
            aria-label="Sugestões de conteúdos"
          >
            {suggestions.length ? (
              <>
                <span className={styles.suggestionsLabel}>
                  Leituras que podem ajudar
                </span>
                {suggestions.map((article) => (
                  <Link
                    href={article.href}
                    key={article.slug}
                    className={styles.suggestion}
                    role="option"
                    aria-selected="false"
                  >
                    <span>{article.category}</span>
                    <strong>{article.title}</strong>
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ))}
                <Link
                  href={`/buscar?q=${encodeURIComponent(query.trim())}`}
                  className={styles.allResults}
                >
                  Ver todos os resultados <ArrowRight size={15} />
                </Link>
              </>
            ) : (
              <div className={styles.noResults}>
                <strong>Ainda não encontramos uma correspondência direta.</strong>
                <Link href={`/buscar?q=${encodeURIComponent(query.trim())}`}>
                  Explorar a busca completa <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className={styles.quickSearches} aria-label="Buscas sugeridas">
        <span>Talvez você esteja buscando:</span>
        {quickSearches.map((item) => (
          <button key={item} type="button" onClick={() => chooseQuickSearch(item)}>
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}
