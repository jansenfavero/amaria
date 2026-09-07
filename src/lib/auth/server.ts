import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { canAccessAdmin, isAccountRole, type AccountRole } from "./policy";

export function authIsConfigured() {
  try {
    getSupabaseConfig();
    getAuthOrigin();
    return true;
  } catch {
    return false;
  }
}

export function getAuthOrigin(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value)
    throw new Error("A URL pública da aplicação não foi configurada.");
  const url = new URL(value);
  const local =
    process.env.NODE_ENV !== "production" &&
    (url.hostname === "localhost" || url.hostname === "127.0.0.1");
  if (
    (url.protocol !== "https:" && !local) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error("Use uma origem HTTPS válida para a autenticação.");
  }
  return url.origin;
}

export type Account = {
  id: string;
  email: string;
  role: AccountRole | null;
  active: boolean;
  displayName: string;
  founderNumber: number | null;
};

/** React cache is request-scoped. Identity and live permissions are server-owned. */
export const getAccount = cache(async (): Promise<Account | null> => {
  if (!authIsConfigured()) return null;
  const cookieStore = await cookies();
  const hasAuthCookie = cookieStore
    .getAll()
    .some(({ name }) => /^sb-.+-auth-token(?:\.\d+)?$/.test(name));
  if (!hasAuthCookie) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;
  if (error || !user || !user.email_confirmed_at || user.is_anonymous)
    return null;
  const { data: sessionActive, error: sessionError } = await supabase.rpc(
    "current_session_is_active",
  );
  if (sessionError) {
    throw new Error("Não foi possível verificar a sessão da conta.");
  }
  if (sessionActive !== true) return null;
  const { data: access, error: accessError } = await supabase
    .from("account_access")
    .select("role, active")
    .eq("user_id", user.id)
    .maybeSingle();
  if (accessError)
    throw new Error("Não foi possível verificar as permissões da conta.");
  if (access?.role === "member" && access.active === true) {
    const { error: founderError } = await supabase.rpc(
      "claim_member_founder_number",
    );
    if (founderError)
      throw new Error("Não foi possível concluir o perfil de membro.");
  }
  const { data: profile, error: profileError } = await supabase
    .from("member_profiles")
    .select("display_name, founder_number")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError)
    throw new Error("Não foi possível carregar o perfil da conta.");
  return {
    id: user.id,
    email: user.email ?? "",
    role: isAccountRole(access?.role) ? access.role : null,
    active: access?.active === true,
    displayName: profile?.display_name ?? "",
    founderNumber: profile?.founder_number ?? null,
  };
});

export async function requireAccount(): Promise<Account> {
  const account = await getAccount();
  if (!account) redirect("/entrar");
  return account;
}

export async function requireAdmin(): Promise<Account> {
  const account = await requireAccount();
  if (!canAccessAdmin(account.role, account.active)) {
    redirect("/minha-conta?aviso=permissao");
  }
  return account;
}
