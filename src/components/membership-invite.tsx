"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  CalendarHeart,
  MessageCircleHeart,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const DISMISS_KEY = "amaria:founder-invite-dismissed";
const HIDE_FOR_MS = 7 * 24 * 60 * 60 * 1000;

export function MembershipInvite() {
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/entrar") ||
      pathname.startsWith("/cadastro") ||
      pathname.startsWith("/meu-perfil") ||
      pathname.startsWith("/auth/")
    ) {
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY) ?? 0);
      if (Date.now() - dismissedAt < HIDE_FOR_MS) return;

      try {
        const { data } = await createClient().auth.getSession();
        if (data.session) return;
      } catch {
        // The invitation can still be shown when auth is temporarily unavailable.
      }

      if (!cancelled && dialog.current && !dialog.current.open) {
        dialog.current.showModal();
      }
    }, 5000);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname]);

  function close() {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    dialog.current?.close();
  }

  return (
    <dialog
      ref={dialog}
      className="membership-dialog"
      aria-labelledby="membership-invite-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="membership-dialog-card">
        <button
          type="button"
          className="membership-dialog-close"
          onClick={close}
          aria-label="Fechar convite"
        >
          <X aria-hidden="true" />
        </button>

        <div className="membership-dialog-image">
          <Image
            src="/membership/founder-invitation.webp"
            alt="Mulher lendo conteúdos da AMARIA em seu smartphone"
            fill
            sizes="(max-width: 760px) calc(100vw - 32px), 680px"
          />
          <span>UM CONVITE PARA VOCÊ</span>
        </div>

        <div className="membership-dialog-copy">
          <p className="eyebrow">
            <Sparkles aria-hidden="true" /> MEMBRO FUNDADORA
          </p>
          <h2 id="membership-invite-title">
            Faça parte do começo da AMARIA.
          </h2>
          <p>
            Crie gratuitamente seu perfil para ler todos os artigos e participar
            das conversas. As <strong>100 primeiras membros</strong> terão
            benefícios e acessos exclusivos na plataforma.
          </p>

          <div className="membership-coming">
            <div>
              <MessageCircleHeart aria-hidden="true" />
              <span>
                <strong>Maria</strong>
                Uma inteligência relacional para ajudar a organizar reflexões
                com mais clareza. Não substitui terapia.
              </span>
            </div>
            <div>
              <UsersRound aria-hidden="true" />
              <span>
                <strong>Comunidade interativa</strong>
                Um espaço moderado para trocas cuidadosas entre mulheres.
              </span>
            </div>
            <div>
              <CalendarHeart aria-hidden="true" />
              <span>
                <strong>Encontros e eventos</strong>
                Experiências e conversas especiais para membros.
              </span>
            </div>
          </div>

          <Link
            href="/cadastro?origem=convite-fundadora"
            className="button button-primary membership-dialog-cta"
            onClick={close}
          >
            Quero ser membro fundadora
          </Link>
          <button type="button" className="membership-later" onClick={close}>
            Continuar explorando por enquanto
          </button>
        </div>
      </div>
    </dialog>
  );
}
