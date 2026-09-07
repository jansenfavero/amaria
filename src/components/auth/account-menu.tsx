"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { signOutAction } from "@/app/auth/actions";
import { useAccount } from "@/components/auth/account-context";
import { canAccessAdmin, roleLabels } from "@/lib/auth/policy";

export function AccountMenu({ mobile = false }: { mobile?: boolean }) {
  const account = useAccount();

  if (!account) {
    return (
      <Link
        href="/entrar?next=/meu-perfil"
        className={`topbar-symbol account-trigger ${mobile ? "is-mobile" : ""}`}
        aria-label="Entrar na AMARIA"
        title="Entrar na AMARIA"
      >
        <Image src="/brand/emblem.webp" alt="" width={40} height={40} />
        <span className="account-state-dot" aria-hidden="true" />
      </Link>
    );
  }

  const admin = canAccessAdmin(account.role, account.active);
  const name = account.displayName.trim() || account.email.split("@")[0];

  return (
    <details className={`account-menu ${mobile ? "is-mobile" : ""}`}>
      <summary className="topbar-symbol account-trigger" aria-label="Abrir menu do perfil">
        <Image src="/brand/emblem.webp" alt="" width={40} height={40} />
        <span className="account-state-dot is-online" aria-hidden="true" />
      </summary>
      <div className="account-dropdown">
        <div className="account-dropdown-heading">
          <span className="account-avatar"><UserRound aria-hidden="true" /></span>
          <div>
            <strong>{name}</strong>
            <span>{account.role ? roleLabels[account.role] : "Membro"}</span>
          </div>
        </div>
        <Link href="/meu-perfil"><UserRound aria-hidden="true" /> Meu Perfil</Link>
        {admin ? (
          <Link href="/admin"><ShieldCheck aria-hidden="true" /> Painel administrativo</Link>
        ) : null}
        <form action={signOutAction}>
          <button type="submit"><LogOut aria-hidden="true" /> Sair da conta</button>
        </form>
      </div>
    </details>
  );
}
