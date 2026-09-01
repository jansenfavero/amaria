import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LogOut, ShieldCheck } from "lucide-react";
import { AuthFrame } from "@/components/auth/auth-frame";
import { requireAccount } from "@/lib/auth/server";
import { canAccessAdmin, roleLabels } from "@/lib/auth/policy";
import { signOutAction } from "@/app/auth/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Minha conta",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const account = await requireAccount();
  const admin = canAccessAdmin(account.role, account.active);
  return (
    <AuthFrame
      eyebrow="MINHA CONTA"
      title="Seu espaço na AMAR.IA."
      description="Acompanhe seu acesso e mantenha sua conta protegida."
    >
      <dl className="account-details">
        <div>
          <dt>E-mail confirmado</dt>
          <dd>{account.email}</dd>
        </div>
        <div>
          <dt>Perfil de acesso</dt>
          <dd>
            {account.role ? roleLabels[account.role] : "Aguardando liberação"}
          </dd>
        </div>
        <div>
          <dt>Permissão da equipe</dt>
          <dd>{account.active ? "Ativa" : "Sem acesso administrativo"}</dd>
        </div>
      </dl>
      {admin ? (
        <Link href="/admin" className="button button-primary auth-submit">
          <ShieldCheck size={19} aria-hidden="true" /> Abrir administração
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      ) : (
        <p className="auth-message">
          Sua identidade foi confirmada. O painel é exclusivo para
          administradores ativos; somente a administração pode liberar ou
          alterar esse acesso.
        </p>
      )}
      <div className="account-actions">
        <Link className="auth-text-link" href="/definir-senha">
          Alterar minha senha
        </Link>
        <form action={signOutAction}>
          <button type="submit" className="auth-signout">
            <LogOut size={18} aria-hidden="true" /> Sair da conta
          </button>
        </form>
      </div>
    </AuthFrame>
  );
}
