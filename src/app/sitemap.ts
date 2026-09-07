import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/articles-server";
import { isIndexable, site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexable) return [];

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/conteudos",
    "/conteudos/buscando-um-relacionamento",
    "/conteudos/estou-me-perdendo-nessa-relacao",
    "/sobre",
    "/maria",
    "/podcasts",
    "/comunidade",
    "/curadoria",
    "/privacidade",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date("2026-09-01T15:40:00.000Z"),
    changeFrequency: path.startsWith("/conteudos") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/conteudos") ? 0.8 : 0.5,
  }));

  const publishedArticles = await getPublishedArticles();
  const articleRoutes: MetadataRoute.Sitemap = publishedArticles.map((article) => ({
    url: `${site.url}${article.href}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...articleRoutes];
}
