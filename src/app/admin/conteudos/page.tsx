import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FilePlus2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AdminNav } from "@/components/admin/admin-nav";
import { PageHero } from "@/components/page-hero";
import { requireAdmin } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Conteúdos | Administração",
  robots: { index: false, follow: false },
};

export default async function AdminContentsPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  await requireAdmin();
  const { aviso } = await searchParams;
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, slug, title, status, updated_at, published_at, article_categories(name)")
    .order("updated_at", { ascending: false });

  return (
    <AppShell>
      <div className="admin-page">
        <PageHero
          eyebrow="CURADORIA EDITORIAL"
          title="Conteúdos."
          description="Crie, revise, programe e acompanhe o acervo da AMARIA."
          image="/editorial/amor-proprio.webp"
          imageAlt="Mulher lendo e organizando conteúdos editoriais"
          compact
        >
          <Link href="/admin/conteudos/novo" className="button button-primary">
            <FilePlus2 size={18} aria-hidden="true" /> Novo artigo
          </Link>
        </PageHero>
        <AdminNav />
        {aviso === "publicado" ? (
          <p className="admin-success" role="status">Artigo salvo com sucesso.</p>
        ) : null}
        <section className="admin-panel-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Artigo</th>
                  <th>Categoria</th>
                  <th>Status</th>
                  <th>Atualizado</th>
                  <th><span className="sr-only">Abrir</span></th>
                </tr>
              </thead>
              <tbody>
                {articles?.length ? articles.map((article) => (
                  <tr key={article.id}>
                    <td><strong>{article.title}</strong><small>/{article.slug}</small></td>
                    <td>{article.article_categories?.name ?? "—"}</td>
                    <td><span className={`status-pill ${article.status}`}>{article.status.replace("_", " ")}</span></td>
                    <td>{new Intl.DateTimeFormat("pt-BR").format(new Date(article.updated_at))}</td>
                    <td>
                      {article.status === "published" ? (
                        <Link href={`/conteudos/${article.slug}`} aria-label={`Abrir ${article.title}`}>
                          <ArrowUpRight aria-hidden="true" />
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="admin-empty">Nenhum artigo criado pelo painel ainda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
