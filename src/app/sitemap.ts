import type { MetadataRoute } from "next";
import { isIndexable, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return isIndexable
    ? [
        "",
        "/sobre",
        "/maria",
        "/podcasts",
        "/comunidade",
        "/curadoria",
        "/privacidade",
      ].map((path) => ({
        url: `${site.url}${path}`,
        changeFrequency: "weekly" as const,
        priority: path === "" ? 1 : 0.6,
      }))
    : [];
}
