export type ArticleSubsection = {
  heading: string;
  paragraphs: readonly string[];
};

export type ArticleSection = {
  heading: string;
  paragraphs: readonly string[];
  subsections?: readonly ArticleSubsection[];
};

export type ArticleCategory = string;

export type ArticleCategorySlug = string;

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
  audioUrl?: string;
  videoUrl?: string;
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
