import "server-only";

import { articles as staticArticles } from "@/content/articles";
import type {
  Article,
  ArticleSection,
} from "@/content/articles/types";
import { authIsConfigured } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";

type ContentShape = {
  introduction?: unknown;
  sections?: unknown;
  reflection?: unknown;
};

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function parseSections(value: unknown): ArticleSection[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    if (typeof record.heading !== "string") return [];
    const subsections = Array.isArray(record.subsections)
      ? record.subsections.flatMap((subsection) => {
          if (!subsection || typeof subsection !== "object") return [];
          const nested = subsection as Record<string, unknown>;
          if (typeof nested.heading !== "string") return [];
          return [
            {
              heading: nested.heading,
              paragraphs: stringArray(nested.paragraphs),
            },
          ];
        })
      : [];
    return [
      {
        heading: record.heading,
        paragraphs: stringArray(record.paragraphs),
        ...(subsections.length ? { subsections } : {}),
      },
    ];
  });
}

function parseContent(value: Json): {
  introduction: string[];
  sections: ArticleSection[];
  reflection: { title: string; questions: string[] };
} {
  const record =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as ContentShape)
      : {};
  const reflection =
    record.reflection &&
    typeof record.reflection === "object" &&
    !Array.isArray(record.reflection)
      ? (record.reflection as Record<string, unknown>)
      : {};
  return {
    introduction: stringArray(record.introduction),
    sections: parseSections(record.sections),
    reflection: {
      title:
        typeof reflection.title === "string"
          ? reflection.title
          : "Uma pausa para se escutar",
      questions: stringArray(reflection.questions),
    },
  };
}

type CmsRow = {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content?: Json;
  preview_content: Json;
  hero_image_path: string;
  hero_alt: string;
  author: string;
  curators: string[];
  keywords: string[];
  seo_title: string;
  seo_description: string;
  reading_minutes: number | null;
  word_count: number | null;
  published_at: string | null;
  updated_at: string;
  audio_url: string;
  video_url: string;
  article_categories:
    | { name: string; slug: string }
    | { name: string; slug: string }[]
    | null;
};

function categoryOf(row: CmsRow) {
  return Array.isArray(row.article_categories)
    ? row.article_categories[0]
    : row.article_categories;
}

function rowToArticle(row: CmsRow, fullContent: boolean): Article {
  const category = categoryOf(row);
  const body = parseContent(
    fullContent && row.content ? row.content : row.preview_content,
  );
  return {
    slug: row.slug,
    href: `/conteudos/${row.slug}`,
    title: row.title,
    subtitle: row.subtitle,
    excerpt: row.excerpt,
    category: category?.name ?? "Conteúdos AMARIA",
    categorySlug: category?.slug ?? "conteudos",
    keywords: row.keywords,
    seoTitle: row.seo_title || row.title,
    seoDescription: row.seo_description || row.excerpt,
    hero: {
      src: row.hero_image_path,
      alt: row.hero_alt,
    },
    publishedAt: row.published_at ?? row.updated_at,
    updatedAt: row.updated_at,
    author: "AMARIA",
    curators: row.curators,
    introduction: body.introduction,
    sections: body.sections,
    reflection: body.reflection,
    relatedSlugs: [],
    readingMinutes: row.reading_minutes ?? 1,
    wordCount: row.word_count ?? 0,
    audioUrl: row.audio_url || undefined,
    videoUrl: row.video_url || undefined,
  };
}

const metadataSelection =
  "slug,title,subtitle,excerpt,preview_content,hero_image_path,hero_alt,author,curators,keywords,seo_title,seo_description,reading_minutes,word_count,published_at,updated_at,audio_url,video_url,article_categories(name,slug)";

export async function getCmsArticle(
  slug: string,
  fullContent: boolean,
): Promise<Article | undefined> {
  if (
    process.env.AMARIA_DISABLE_REMOTE_FOR_SMOKE === "true" ||
    !authIsConfigured()
  )
    return undefined;
  try {
    const supabase = await createClient();
    const selection = fullContent
      ? `${metadataSelection},content`
      : metadataSelection;
    const { data, error } = await supabase
      .from("articles")
      .select(selection)
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return undefined;
    return rowToArticle(data as unknown as CmsRow, fullContent);
  } catch {
    return undefined;
  }
}

export async function getPublishedArticles(): Promise<Article[]> {
  if (
    process.env.AMARIA_DISABLE_REMOTE_FOR_SMOKE === "true" ||
    !authIsConfigured()
  )
    return staticArticles;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("articles")
      .select(metadataSelection)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });
    if (error || !data) return staticArticles;
    const known = new Set(staticArticles.map((article) => article.slug));
    const cms = (data as unknown as CmsRow[])
      .filter((row) => !known.has(row.slug))
      .map((row) => rowToArticle(row, false));
    return [...cms, ...staticArticles];
  } catch {
    return staticArticles;
  }
}
