"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAccount } from "@/lib/auth/server";

export async function registerMemberAction(
  _previous: { kind: string; message: string },
  formData: FormData,
): Promise<{ kind: string; message: string }> {
  const displayName = formData.get("display_name")?.toString().trim() || "";
  const bio = formData.get("bio")?.toString().trim() || "";
  const isFoundingMember = formData.get("is_founding_member") === "on";

  if (!displayName || displayName.length < 2) {
    return { kind: "error", message: "Informe um nome válido para exibição." };
  }

  try {
    const supabase = await createClient();
    const account = await getAccount();

    if (!account) {
      return { kind: "error", message: "Você precisa estar logada para se cadastrar como membro." };
    }

    // Check if profile already exists
    const { data: existing } = await supabase
      .from("member_profiles")
      .select("user_id")
      .eq("user_id", account.id)
      .single();

    if (existing) {
      return { kind: "error", message: "Você já é membro da plataforma." };
    }

    // Create member profile
    const { error } = await supabase.from("member_profiles").insert({
      user_id: account.id,
      display_name: displayName,
      bio: bio.slice(0, 500),
      is_founding_member: isFoundingMember,
    });

    if (error) {
      throw error;
    }

    revalidatePath("/meu-perfil");
    revalidatePath("/");
    return { kind: "success", message: "Cadastro realizado com sucesso! Bem-vinda à AMARIA." };
  } catch (error) {
    console.error("Error registering member:", error);
    return { kind: "error", message: "Não foi possível realizar o cadastro. Tente novamente." };
  }
}

export async function updateMemberProfileAction(
  _previous: { kind: string; message: string },
  formData: FormData,
): Promise<{ kind: string; message: string }> {
  const displayName = formData.get("display_name")?.toString().trim() || "";
  const bio = formData.get("bio")?.toString().trim() || "";

  if (!displayName || displayName.length < 2) {
    return { kind: "error", message: "Informe um nome válido para exibição." };
  }

  try {
    const supabase = await createClient();
    const account = await getAccount();

    if (!account) {
      return { kind: "error", message: "Você precisa estar logada." };
    }

    const { error } = await supabase
      .from("member_profiles")
      .update({
        display_name: displayName,
        bio: bio.slice(0, 500),
        last_active_at: new Date().toISOString(),
      })
      .eq("user_id", account.id);

    if (error) {
      throw error;
    }

    revalidatePath("/meu-perfil");
    return { kind: "success", message: "Perfil atualizado com sucesso!" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { kind: "error", message: "Não foi possível atualizar o perfil. Tente novamente." };
  }
}

export async function trackArticleAccessAction(
  articleSlug: string,
  percentageRead: number,
): Promise<void> {
  try {
    const supabase = await createClient();
    const account = await getAccount();

    await supabase.from("article_access").upsert(
      {
        user_id: account?.id || null,
        article_slug: articleSlug,
        percentage_read: Math.min(100, Math.max(0, percentageRead)),
        completed: percentageRead >= 100,
        accessed_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,article_slug",
      },
    );
  } catch (error) {
    console.error("Error tracking article access:", error);
  }
}

export async function recordPageViewAction(
  pagePath: string,
  articleSlug?: string,
  sessionId?: string,
  deviceType?: "desktop" | "mobile" | "tablet" | null,
  referrer?: string,
): Promise<void> {
  try {
    const supabase = await createClient();
    const account = await getAccount();

    await supabase.from("page_views").insert({
      page_path: pagePath,
      article_slug: articleSlug || null,
      user_id: account?.id || null,
      session_id: sessionId || "anonymous",
      device_type: deviceType as "desktop" | "mobile" | "tablet" | null || null,
      referrer: referrer || null,
    });
  } catch (error) {
    console.error("Error recording page view:", error);
  }
}

export async function toggleArticleLikeAction(
  articleId: string,
  sessionId?: string,
): Promise<{ liked: boolean; count: number }> {
  try {
    const supabase = await createClient();
    const account = await getAccount();

    // Check if already liked
    const { data: existing } = await supabase
      .from("article_likes")
      .select("id")
      .eq("article_id", articleId)
      .eq("user_id", account?.id || "")
      .single();

    if (existing) {
      // Unlike
      await supabase.from("article_likes").delete().eq("id", existing.id);
      const { data: countData } = await supabase
        .from("article_likes")
        .select("id", { count: "exact" })
        .eq("article_id", articleId);
      return { liked: false, count: countData?.length || 0 };
    } else {
      // Like
      await supabase.from("article_likes").insert({
        article_id: articleId,
        user_id: account?.id || null,
        session_id: account ? null : sessionId || null,
      });
      const { data: countData } = await supabase
        .from("article_likes")
        .select("id", { count: "exact" })
        .eq("article_id", articleId);
      return { liked: true, count: countData?.length || 0 };
    }
  } catch (error) {
    console.error("Error toggling article like:", error);
    return { liked: false, count: 0 };
  }
}

export async function addCommentAction(
  _previous: { kind: string; message: string },
  formData: FormData,
): Promise<{ kind: string; message: string; commentId?: string }> {
  const articleId = formData.get("article_id")?.toString() || "";
  const content = formData.get("content")?.toString().trim() || "";
  const parentCommentId = formData.get("parent_comment_id")?.toString() || null;

  if (!articleId || !content) {
    return { kind: "error", message: "Preencha todos os campos obrigatórios." };
  }

  if (content.length < 1 || content.length > 2000) {
    return { kind: "error", message: "O comentário deve ter entre 1 e 2000 caracteres." };
  }

  try {
    const supabase = await createClient();
    const account = await getAccount();

    if (!account) {
      return { kind: "error", message: "Você precisa estar logada para comentar." };
    }

    // Check if user is a member
    const { data: memberProfile } = await supabase
      .from("member_profiles")
      .select("user_id")
      .eq("user_id", account.id)
      .single();

    if (!memberProfile) {
      return { 
        kind: "error", 
        message: "Apenas membros podem comentar. Cadastre-se gratuitamente para participar." 
      };
    }

    const { data, error } = await supabase
      .from("article_comments")
      .insert({
        article_id: articleId,
        user_id: account.id,
        parent_comment_id: parentCommentId,
        content: content,
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    revalidatePath(`/conteudos/*`);
    return { kind: "success", message: "Comentário publicado com sucesso!", commentId: data?.id };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { kind: "error", message: "Não foi possível publicar o comentário. Tente novamente." };
  }
}

export async function toggleCommentLikeAction(
  commentId: string,
): Promise<{ liked: boolean; count: number }> {
  try {
    const supabase = await createClient();
    const account = await getAccount();

    if (!account) {
      return { liked: false, count: 0 };
    }

    // Check if already liked
    const { data: existing } = await supabase
      .from("comment_likes")
      .select("id")
      .eq("comment_id", commentId)
      .eq("user_id", account.id)
      .single();

    if (existing) {
      // Unlike
      await supabase.from("comment_likes").delete().eq("id", existing.id);
      const { data: comment } = await supabase
        .from("article_comments")
        .select("likes_count")
        .eq("id", commentId)
        .single();
      return { liked: false, count: comment?.likes_count || 0 };
    } else {
      // Like
      await supabase.from("comment_likes").insert({
        comment_id: commentId,
        user_id: account.id,
      });
      const { data: comment } = await supabase
        .from("article_comments")
        .select("likes_count")
        .eq("id", commentId)
        .single();
      return { liked: true, count: comment?.likes_count || 0 };
    }
  } catch (error) {
    console.error("Error toggling comment like:", error);
    return { liked: false, count: 0 };
  }
}

export async function getDashboardMetricsAction(): Promise<{
  total_members: number;
  founding_members_count: number;
  new_members_this_month: number;
  total_articles: number;
  total_page_views: number;
  page_views_this_month: number;
  total_article_likes: number;
  total_comments: number;
  comments_this_month: number;
  articles_with_full_reads: number;
} | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("dashboard_metrics").select("*").single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error getting dashboard metrics:", error);
    return null;
  }
}
