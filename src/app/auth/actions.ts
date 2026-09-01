"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { authIsConfigured, getAuthOrigin } from "@/lib/auth/server";
import {
  PRIVACY_NOTICE_VERSION,
  validEmail,
  validNewPassword,
  type AuthFormState,
} from "@/lib/auth/policy";

function failure(message: string): AuthFormState {
  return { kind: "error", message };
}
function field(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
}

export async function signInAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = field(formData, "email").trim();
  const password = field(formData, "password");
  if (!validEmail(email) || !password || password.length > 256) {
    return failure("Confira seu e-mail e sua senha para continuar.");
  }
  if (!authIsConfigured())
    return failure(
      "O acesso está em configuração. Tente novamente mais tarde.",
    );
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error)
      return failure(
        "Não foi possível entrar. Confira os dados e a confirmação do seu e-mail. Se precisar, recupere seu acesso.",
      );
  } catch {
    return failure(
      "Não conseguimos conectar agora. Aguarde um momento e tente novamente.",
    );
  }
  revalidatePath("/minha-conta");
  redirect("/minha-conta");
}

export async function recoverAccessAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = field(formData, "email").trim();
  if (!validEmail(email)) return failure("Informe um e-mail válido.");
  if (!authIsConfigured())
    return failure(
      "O acesso está em configuração. Tente novamente mais tarde.",
    );
  try {
    const supabase = await createClient();
    // Supabase enforces sending limits. Never reveal whether this email exists.
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getAuthOrigin()}/auth/callback`,
    });
  } catch {
    return failure(
      "Não conseguimos conectar agora. Aguarde um momento e tente novamente.",
    );
  }
  return {
    kind: "success",
    message:
      "Se houver uma conta para este e-mail e o envio estiver disponível, você receberá as instruções. Confira também o spam e abra o link neste mesmo navegador.",
  };
}

export async function setPasswordAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const password = field(formData, "password");
  if (!validNewPassword(password))
    return failure(
      "Use pelo menos 12 caracteres, com no máximo 72 bytes. Uma frase longa e única é uma boa escolha.",
    );
  if (password !== field(formData, "confirmation"))
    return failure("As senhas não coincidem. Confira os dois campos.");
  if (formData.get("privacy") !== "on")
    return failure("Leia e confirme o aviso de privacidade para continuar.");
  if (!authIsConfigured())
    return failure("O acesso está temporariamente indisponível.");
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user?.email_confirmed_at || data.user.is_anonymous) {
      return failure(
        "Seu acesso expirou. Solicite um novo link de recuperação.",
      );
    }
    const { data: sessionActive, error: sessionError } = await supabase.rpc(
      "current_session_is_active",
    );
    if (sessionError || sessionActive !== true) {
      return failure(
        "Seu acesso expirou. Solicite um novo link de recuperação.",
      );
    }
    const { error: acknowledgementError } = await supabase
      .from("privacy_acknowledgements")
      .upsert(
        { user_id: data.user.id, notice_version: PRIVACY_NOTICE_VERSION },
        {
          onConflict: "user_id,notice_version",
          ignoreDuplicates: true,
        },
      );
    if (acknowledgementError)
      return failure(
        "Não conseguimos registrar a leitura do aviso. Tente novamente.",
      );
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError)
      return failure(
        "Não foi possível salvar essa senha. Escolha uma senha nova e forte ou solicite outro link.",
      );
    // The next visit must authenticate with the new password.
    const { error: signOutError } = await supabase.auth.signOut({
      scope: "global",
    });
    if (signOutError)
      return failure(
        "Sua senha foi atualizada, mas não conseguimos encerrar as sessões. Use Sair da conta e entre novamente.",
      );
  } catch {
    return failure(
      "Não conseguimos concluir agora. Tente novamente ou recupere seu acesso.",
    );
  }
  revalidatePath("/minha-conta");
  redirect("/entrar?aviso=senha-atualizada");
}

export async function signOutAction(): Promise<void> {
  if (authIsConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error)
      throw new Error("Não foi possível encerrar a sessão. Tente novamente.");
  }
  revalidatePath("/minha-conta");
  redirect("/entrar?aviso=sessao-encerrada");
}
