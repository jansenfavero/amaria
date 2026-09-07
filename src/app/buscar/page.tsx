import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { SearchExperience } from "@/components/search-experience";
import { getPublishedArticles } from "@/lib/articles-server";

export const metadata: Metadata = {
  title: "Buscar conteúdos",
  description:
    "Busque artigos e reflexões da AMARIA sobre relacionamentos, intenção, compatibilidade e reciprocidade.",
  alternates: { canonical: "/buscar" },
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const initialQuery = Array.isArray(q) ? q[0] : (q ?? "");
  const articles = await getPublishedArticles();

  return (
    <AppShell>
      <SearchExperience articles={articles} initialQuery={initialQuery} />
    </AppShell>
  );
}
