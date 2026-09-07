import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { AdminNav } from "@/components/admin/admin-nav";
import { PageHero } from "@/components/page-hero";
import { moderateCommentAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Comentários | Administração",
  robots: { index: false, follow: false },
};

export default async function AdminCommentsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: comments } = await supabase
    .from("article_comments")
    .select("id, article_slug, author_name, body, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <AppShell>
      <div className="admin-page">
        <PageHero
          eyebrow="MODERAÇÃO"
          title="Conversas nos artigos."
          description="Preserve um espaço respeitoso, seguro e coerente com a curadoria."
          image="/editorial/relacionamentos.webp"
          imageAlt="Mulheres conversando com respeito e acolhimento"
          compact
        />
        <AdminNav />
        <section className="moderation-list">
          {comments?.length ? comments.map((comment) => (
            <article className="moderation-card" key={comment.id}>
              <header>
                <div><strong>{comment.author_name}</strong><span>em /{comment.article_slug}</span></div>
                <span className={`status-pill ${comment.status}`}>{comment.status}</span>
              </header>
              <p>{comment.body}</p>
              <footer>
                <time>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(comment.created_at))}</time>
                <div>
                  <form action={moderateCommentAction}>
                    <input type="hidden" name="comment_id" value={comment.id} />
                    <input type="hidden" name="status" value="published" />
                    <button type="submit">Publicar</button>
                  </form>
                  <form action={moderateCommentAction}>
                    <input type="hidden" name="comment_id" value={comment.id} />
                    <input type="hidden" name="status" value="hidden" />
                    <button type="submit" className="danger">Ocultar</button>
                  </form>
                </div>
              </footer>
            </article>
          )) : <p className="admin-empty">Ainda não há comentários para moderar.</p>}
        </section>
      </div>
    </AppShell>
  );
}
