export type ArticleSubsection = {
  heading: string;
  paragraphs: readonly string[];
};

export type ArticleSection = {
  heading: string;
  paragraphs: readonly string[];
  subsections?: readonly ArticleSubsection[];
};

export type ArticleCategory =
  | "Buscando um relacionamento"
  | "Estou me perdendo nessa relação";

export type ArticleCategorySlug =
  | "buscando-um-relacionamento"
  | "estou-me-perdendo-nessa-relacao";

export type ArticleDraft = {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: ArticleCategory;
  categorySlug: ArticleCategorySlug;
  keywords: readonly string[];
  seoTitle: string;
  seoDescription: string;
  hero: {
    src: string;
    alt: string;
  };
  publishedAt: string;
  updatedAt: string;
  author: "AMARIA";
  curators: readonly string[];
  introduction: readonly string[];
  sections: readonly ArticleSection[];
  reflection: {
    title: string;
    questions: readonly string[];
  };
  relatedSlugs: readonly string[];
};

export type Article = ArticleDraft & {
  href: string;
  readingMinutes: number;
  wordCount: number;
};
