import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Crown,
  LogOut,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AuthFrame } from "@/components/auth/auth-frame";
import {
  deleteAccountAction,
  signOutAction,
  updateProfileAction,
} from "@/app/auth/actions";
import { requireAccount } from "@/lib/auth/server";
import { canAccessAdmin, roleLabels } from "@/lib/auth/policy";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Meu Perfil",
  robots: { index: false, follow: false },
};

export default async function MemberProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  const account = await requireAccount();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("member_profiles")
    .select("display_name, founder_number, marketing_opt_in, created_at")
    .eq("id", account.id)
    .single();
  const { aviso } = await searchParams;
  const admin = canAccessAdmin(account.role, account.active);

  return (
    <AuthFrame
      eyebrow="MEU PERFIL"
      title={profile?.display_name ? `Olá, ${profile.display_name}.` : "Seu espaço na AMARIA."}
      description="Acompanhe sua participação, escolha como quer receber novidades e volte às leituras que fazem sentido para você."
    >
      {profile?.founder_number ? (
        <div className="founder-badge">
          <Crown aria-hidden="true" />
          <div>
            <strong>Membro fundadora #{profile.founder_number}</strong>
            <span>Você está entre as 100 primeiras mulheres da AMARIA.</span>
          </div>
        </div>
      ) : null}

      {aviso === "salvo" ? (
        <p className="auth-message auth-message-success" role="status">
          Perfil atualizado com sucesso.
        </p>
      ) : aviso ? (
        <p className="auth-message auth-message-error" role="alert">
          Não foi possível concluir essa ação. Confira os dados e tente novamente.
        </p>
      ) : null}

      <div className="member-benefits">
        <div>
          <BookOpenText aria-hidden="true" />
          <strong>Leituras completas</strong>
          <span>Acesso gratuito a todos os artigos.</span>
        </div>
        <div>
          <MessageCircleHeart aria-hidden="true" />
          <strong>Conversas nos artigos</strong>
          <span>Comente com cuidado e presença.</span>
        </div>
        <div>
          <Sparkles aria-hidden="true" />
          <strong>Próximos capítulos</strong>
          <span>Maria, comunidade e encontros em breve.</span>
        </div>
      </div>

      <form action={updateProfileAction} className="profile-form">
        <div className="auth-field">
          <label htmlFor="display_name">Seu nome</label>
          <input
            id="display_name"
            name="display_name"
            defaultValue={profile?.display_name ?? ""}
            minLength={2}
            maxLength={80}
            required
          />
        </div>
        <label className="auth-checkbox">
          <input
            type="checkbox"
            name="marketing"
            defaultChecked={profile?.marketing_opt_in ?? false}
          />
          <span>Quero receber novidades editoriais e convites da AMARIA.</span>
        </label>
        <button type="submit" className="button button-primary">
          Salvar meu perfil <ArrowRight size={17} aria-hidden="true" />
        </button>
      </form>

      <dl className="account-details">
        <div>
          <dt>E-mail confirmado</dt>
          <dd>{account.email}</dd>
        </div>
        <div>
          <dt>Perfil de acesso</dt>
          <dd>{account.role ? roleLabels[account.role] : "Membro"}</dd>
        </div>
      </dl>

      {admin ? (
        <Link href="/admin" className="button button-secondary profile-admin-link">
          <ShieldCheck size={18} aria-hidden="true" />
          Abrir painel administrativo
        </Link>
      ) : null}

      <div className="account-actions">
        <Link className="auth-text-link" href="/definir-senha">
          Alterar minha senha
        </Link>
        <form action={signOutAction}>
          <button type="submit" className="auth-signout">
            <LogOut size={18} aria-hidden="true" /> Sair
          </button>
        </form>
      </div>

      <details className="delete-account">
        <summary>Excluir meu perfil e meus dados</summary>
        <p>
          Esta ação é permanente e remove seu acesso, perfil e comentários.
          Digite <strong>EXCLUIR MINHA CONTA</strong> para confirmar.
        </p>
        <form action={deleteAccountAction}>
          <label htmlFor="confirmation">Confirmação</label>
          <input id="confirmation" name="confirmation" required />
          <button type="submit">Excluir definitivamente</button>
        </form>
      </details>
    </AuthFrame>
  );
}

