import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { AdminNav } from "@/components/admin/admin-nav";
import { ArticleEditor } from "@/components/admin/article-editor";
import { requireAdmin } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Novo artigo | Administração",
  robots: { index: false, follow: false },
};

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  await requireAdmin();
  const { aviso } = await searchParams;
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("article_categories")
    .select("id, name")
    .eq("status", "active")
    .order("sort_order");

  return (
    <AppShell>
      <div className="admin-page admin-editor-page">
        <header className="admin-heading">
          <p className="auth-kicker">NOVO CONTEÚDO</p>
          <h1>Uma nova leitura começa aqui.</h1>
          <p>
            Estruture texto, mídia, curadoria e descoberta em uma única
            experiência editorial.
          </p>
        </header>
        <AdminNav />
        <ArticleEditor categories={categories ?? []} warning={aviso} />
      </div>
    </AppShell>
  );
}

