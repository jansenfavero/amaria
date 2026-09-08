"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  authIsConfigured,
  getAuthOrigin,
  requireAccount,
} from "@/lib/auth/server";
import {
  MEMBER_PRIVACY_NOTICE_VERSION,
  PRIVACY_NOTICE_VERSION,
  safeAuthDestination,
  validEmail,
  validDisplayName,
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

function safeNext(formData: FormData) {
  return safeAuthDestination(field(formData, "next"));
}

export async function signUpAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const displayName = field(formData, "display_name").trim();
  const email = field(formData, "email").trim().toLowerCase();
  const password = field(formData, "password");
  const next = safeNext(formData);
  if (!validDisplayName(displayName))
    return failure("Informe seu nome com 2 a 80 caracteres.");
  if (!validEmail(email)) return failure("Informe um e-mail válido.");
  if (!validNewPassword(password))
    return failure(
      "Use pelo menos 6 caracteres, combinando ao menos uma letra e um número.",
    );
  if (password !== field(formData, "confirmation"))
    return failure("As senhas não coincidem.");
  if (formData.get("privacy") !== "on")
    return failure("Leia e aceite o aviso de privacidade para continuar.");
  if (!authIsConfigured())
    return failure("O cadastro está temporariamente indisponível.");

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getAuthOrigin()}/auth/callback?next=${encodeURIComponent(next)}`,
        data: {
          display_name: displayName,
          privacy_notice_version: MEMBER_PRIVACY_NOTICE_VERSION,
          marketing_opt_in: formData.get("marketing") === "on",
        },
      },
    });
    if (error) {
      if (error.code === "signup_disabled") {
        return failure(
          "Novos cadastros estão temporariamente pausados. A equipe AMARIA já foi avisada.",
        );
      }
      return failure(
        "Não foi possível concluir o cadastro. Confira os dados ou tente novamente em alguns minutos.",
      );
    }
    if (data.session) {
      // A public signup must never leave an active session before the user
      // completes the email-verification flow configured in Supabase Auth.
      await supabase.auth.signOut({ scope: "global" });
    }
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    return failure(
      "Não conseguimos conectar agora. Aguarde um momento e tente novamente.",
    );
  }

  return {
    kind: "success",
    message:
      "Cadastro recebido. Enviamos um e-mail da AMARIA: confirme o endereço para ativar seu perfil e continuar a leitura.",
  };
}

export async function signInAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = field(formData, "email").trim();
  const password = field(formData, "password");
  const next = safeNext(formData);
  if (!validEmail(email) || !password || password.length > 256) {
    return failure("Confira seu e-mail e sua senha para continuar.");
  }
  if (!authIsConfigured())
    return failure(
      "O acesso está em configuração. Tente novamente mais tarde.",
    );
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error?.code === "email_not_confirmed") {
      return failure(
        "Confirme seu e-mail antes de entrar. Abra a mensagem mais recente enviada pela AMARIA.",
      );
    }
    if (error)
      return failure(
        "Não foi possível entrar. Se ainda não criou seu perfil, use “Criar conta”. Se já criou, confira a senha e a confirmação do e-mail.",
      );
    if (!data.user?.email_confirmed_at || data.user.is_anonymous) {
      await supabase.auth.signOut({ scope: "global" });
      return failure(
        "Confirme seu e-mail antes de entrar. Abra a mensagem mais recente enviada pela AMARIA.",
      );
    }
  } catch {
    return failure(
      "Não conseguimos conectar agora. Aguarde um momento e tente novamente.",
    );
  }
  revalidatePath("/minha-conta");
  redirect(next);
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
      redirectTo: `${getAuthOrigin()}/auth/callback?next=/definir-senha`,
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
      "Use pelo menos 6 caracteres, combinando ao menos uma letra e um número.",
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

export async function updateProfileAction(formData: FormData): Promise<void> {
  const account = await requireAccount();
  const displayName = field(formData, "display_name").trim();
  if (!validDisplayName(displayName)) redirect("/meu-perfil?aviso=nome");
  const supabase = await createClient();
  const { error } = await supabase
    .from("member_profiles")
    .update({
      display_name: displayName,
      marketing_opt_in: formData.get("marketing") === "on",
    })
    .eq("id", account.id);
  if (error) redirect("/meu-perfil?aviso=erro");
  revalidatePath("/meu-perfil");
  redirect("/meu-perfil?aviso=salvo");
}

export async function deleteAccountAction(formData: FormData): Promise<void> {
  const confirmation = field(formData, "confirmation");
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_my_account", {
    p_confirmation: confirmation,
  });
  if (error) redirect("/meu-perfil?aviso=exclusao");
  redirect("/?conta=excluida");
}
