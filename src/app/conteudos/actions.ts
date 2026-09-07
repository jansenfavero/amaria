"use server";

import { revalidatePath } from "next/cache";
import { requireAccount } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

export type CommentState = {
  kind: "idle" | "error" | "success";
  message: string;
};

function value(formData: FormData, name: string) {
  const item = formData.get(name);
  return typeof item === "string" ? item : "";
}

export async function createCommentAction(
  _previous: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const account = await requireAccount();
  const articleSlug = value(formData, "article_slug");
  const body = value(formData, "body").trim();

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(articleSlug)) {
    return { kind: "error", message: "Artigo inválido." };
  }
  if (body.length < 3 || body.length > 2000) {
    return {
      kind: "error",
      message: "Escreva um comentário entre 3 e 2.000 caracteres.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("article_comments").insert({
    article_slug: articleSlug,
    user_id: account.id,
    body,
  });
  if (error) {
    return {
      kind: "error",
      message: "Não foi possível publicar agora. Tente novamente.",
    };
  }

  revalidatePath(`/conteudos/${articleSlug}`);
  return {
    kind: "success",
    message: "Seu comentário foi publicado com cuidado.",
  };
}

