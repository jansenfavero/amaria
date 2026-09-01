import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { SearchExperience } from "@/components/search-experience";
import { articles } from "@/content/articles";

export const metadata: Metadata = {
  title: "Buscar conteúdos",
  description:
    "Busque artigos e reflexões da AMAR.IA sobre relacionamentos, intenção, compatibilidade e reciprocidade.",
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

  return (
    <AppShell>
      <SearchExperience articles={articles} initialQuery={initialQuery} />
    </AppShell>
  );
}
