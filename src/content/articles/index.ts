import type { Article, ArticleDraft } from "@/content/articles/types";
import { collectionOne } from "@/content/articles/relationship-collection-one";
import { collectionTwo } from "@/content/articles/relationship-collection-two";
import { selfLossCollectionOne } from "@/content/articles/self-loss-collection-one";

export const articleCategories = [
  {
    name: "Buscando um relacionamento",
    slug: "buscando-um-relacionamento",
    description:
      "Clareza, critérios e escolhas mais conscientes para mulheres que desejam construir uma relação séria.",
  },
  {
    name: "Estou me perdendo nessa relação",
    slug: "estou-me-perdendo-nessa-relacao",
    description:
      "Sinais, limites e reflexões para reconhecer quando um vínculo começa a reduzir sua autonomia, sua voz ou sua segurança.",
  },
] as const;

export const articleCategory = articleCategories[0];
export const selfLossArticleCategory = articleCategories[1];

const linkMarker = /\[\[([^|]+)\|([^\]]+)\]\]/g;

export function plainArticleText(value: string) {
  return value.replace(linkMarker, "$1");
}

function countWords(article: ArticleDraft) {
  const text = [
    article.title,
    article.subtitle,
    ...article.introduction,
    ...article.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.subsections?.flatMap((subsection) => [
        subsection.heading,
        ...subsection.paragraphs,
      ]) ?? []),
    ]),
    ...article.reflection.questions,
  ]
    .map(plainArticleText)
    .join(" ");

  return text.trim().split(/\s+/).filter(Boolean).length;
}

const drafts = [
  ...(selfLossCollectionOne as unknown as ArticleDraft[]),
  ...(collectionOne as unknown as ArticleDraft[]),
  ...(collectionTwo as unknown as ArticleDraft[]),
];

export const articles: Article[] = drafts.map((article) => {
  const wordCount = countWords(article);
  return {
    ...article,
    href: `/conteudos/${article.slug}`,
    wordCount,
    readingMinutes: Math.max(1, Math.ceil(wordCount / 210)),
  };
});

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(
  categorySlug: ArticleDraft["categorySlug"],
) {
  return articles.filter((article) => article.categorySlug === categorySlug);
}

export function getRelatedArticles(article: Article, limit = 3) {
  const selected = article.relatedSlugs
    .map((slug) => getArticle(slug))
    .filter((item): item is Article => Boolean(item));

  if (selected.length >= limit) return selected.slice(0, limit);

  const fallbacks = articles.filter(
    (candidate) =>
      candidate.slug !== article.slug &&
      !selected.some((item) => item.slug === candidate.slug),
  );

  return [...selected, ...fallbacks].slice(0, limit);
}

export function getAdjacentArticles(article: Article) {
  const index = articles.findIndex((item) => item.slug === article.slug);
  return {
    previous: index > 0 ? articles[index - 1] : undefined,
    next: index < articles.length - 1 ? articles[index + 1] : undefined,
  };
}
