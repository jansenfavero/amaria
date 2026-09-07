import Link from "next/link";
import { MessageCircleHeart, UserRoundPlus } from "lucide-react";
import { CommentForm } from "@/components/comment-form";
import { authIsConfigured } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

type PublicComment = {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
};

export async function ArticleComments({
  articleSlug,
  isMember,
}: {
  articleSlug: string;
  isMember: boolean;
}) {
  let comments: PublicComment[] = [];
  if (
    authIsConfigured() &&
    process.env.AMARIA_DISABLE_REMOTE_FOR_SMOKE !== "true"
  ) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("article_comments")
        .select("id, author_name, body, created_at")
        .eq("article_slug", articleSlug)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(40);
      comments = data ?? [];
    } catch {
      // A leitura continua disponível se a conversa estiver temporariamente offline.
    }
  }

  return (
    <section className="article-comments" id="comentarios" aria-labelledby="comments-title">
      <div className="comments-heading">
        <span className="eyebrow">
          <MessageCircleHeart aria-hidden="true" /> CONVERSAS
        </span>
        <h2 id="comments-title">O que esta leitura despertou em você?</h2>
        <p>Um espaço moderado para compartilhar experiências com respeito.</p>
      </div>

      {isMember ? (
        <CommentForm articleSlug={articleSlug} />
      ) : (
        <div className="comments-membership">
          <UserRoundPlus aria-hidden="true" />
          <div>
            <strong>Entre para participar da conversa.</strong>
            <p>O cadastro é gratuito e leva apenas alguns instantes.</p>
          </div>
          <Link href={`/cadastro?next=/conteudos/${articleSlug}#comentarios`} className="button button-primary">
            Criar meu perfil
          </Link>
        </div>
      )}

      <div className="comment-list" aria-label="Comentários publicados">
        {comments?.length ? (
          comments.map((comment) => (
            <article key={comment.id} className="comment-card">
              <div className="comment-avatar" aria-hidden="true">
                {comment.author_name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <header>
                  <strong>{comment.author_name}</strong>
                  <time dateTime={comment.created_at}>
                    {new Intl.DateTimeFormat("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(comment.created_at))}
                  </time>
                </header>
                <p>{comment.body}</p>
              </div>
            </article>
          ))
        ) : (
          <p className="comments-empty">
            Esta conversa está começando. Quando fizer sentido, deixe a primeira
            reflexão.
          </p>
        )}
      </div>
    </section>
  );
}
