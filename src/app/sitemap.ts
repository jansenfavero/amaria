import type { MetadataRoute } from "next";
import { isIndexable, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return isIndexable
    ? [{ url: site.url, changeFrequency: "weekly", priority: 1 }]
    : [];
}
