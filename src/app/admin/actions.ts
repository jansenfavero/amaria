"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/server";
import {
  countEditorialWords,
  createPreviewContent,
  parseEditorialBody,
  slugify,
} from "@/lib/editorial-cms";
import type { Json } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

const articleStatuses = [
  "draft",
  "in_review",
  "ready",
  "scheduled",
  "published",
  "archived",
] as const;

type ArticleStatus = (typeof articleStatuses)[number];

function isArticleStatus(value: string): value is ArticleStatus {
  return articleStatuses.some((status) => status === value);
}

function field(formData: FormData, name: string) {
  const item = formData.get(name);
  return typeof item === "string" ? item.trim() : "";
}

export async function saveArticleAction(formData: FormData): Promise<void> {
  const account = await requireAdmin();
  const title = field(formData, "title");
  const slug = slugify(field(formData, "slug") || title);
  const categoryId = field(formData, "category_id");
  const subtitle = field(formData, "subtitle");
  const excerpt = field(formData, "excerpt");
  const body = field(formData, "body");
  const heroImage = field(formData, "hero_image_path");
  const heroAlt = field(formData, "hero_alt");
  const status = field(formData, "status");
  if (
    title.length < 10 ||
    !slug ||
    !categoryId ||
    excerpt.length < 20 ||
    body.length < 120 ||
    !heroImage ||
    !heroAlt ||
    !isArticleStatus(status)
  ) {
    redirect("/admin/conteudos/novo?aviso=campos");
  }

  const content = parseEditorialBody(
    body,
    field(formData, "reflection_title"),
    field(formData, "reflection_questions"),
  );
  const wordCount = countEditorialWords(content);
  if (wordCount < 80) redirect("/admin/conteudos/novo?aviso=conteudo");

  const publishedInput = field(formData, "published_at");
  const parsedPublicationDate = publishedInput
    ? new Date(publishedInput)
    : null;
  if (
    (status === "scheduled" && !parsedPublicationDate) ||
    (parsedPublicationDate && Number.isNaN(parsedPublicationDate.getTime()))
  ) {
    redirect("/admin/conteudos/novo?aviso=data");
  }
  const publishedAt =
    status === "published"
      ? parsedPublicationDate
        ? parsedPublicationDate.toISOString()
        : new Date().toISOString()
      : status === "scheduled" && parsedPublicationDate
        ? parsedPublicationDate.toISOString()
        : null;

  const supabase = await createClient();
  const { error } = await supabase.from("articles").insert({
    category_id: categoryId,
    slug,
    title,
    subtitle,
    excerpt,
    content: content as unknown as Json,
    preview_content: createPreviewContent(content) as unknown as Json,
    hero_image_path: heroImage,
    hero_alt: heroAlt,
    audio_url: field(formData, "audio_url"),
    video_url: field(formData, "video_url"),
    author: "AMARIA",
    curators: field(formData, "curators")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    keywords: field(formData, "keywords")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 20),
    seo_title: field(formData, "seo_title") || title,
    seo_description: field(formData, "seo_description") || excerpt,
    canonical_path: `/conteudos/${slug}`,
    status,
    featured: formData.get("featured") === "on",
    reading_minutes: Math.max(1, Math.ceil(wordCount / 210)),
    word_count: wordCount,
    published_at: publishedAt,
    updated_by: account.id,
  });

  if (error) redirect("/admin/conteudos/novo?aviso=erro");
  revalidatePath("/conteudos");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  redirect("/admin/conteudos?aviso=publicado");
}

export async function moderateCommentAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const commentId = field(formData, "comment_id");
  const status = field(formData, "status");
  const supabase = await createClient();
  await supabase.rpc("admin_moderate_comment", {
    p_comment_id: commentId,
    p_status: status,
  });
  revalidatePath("/admin/comentarios");
}
