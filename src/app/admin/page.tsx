import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookHeart, KeyRound, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { requireAdmin } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Administração",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const account = await requireAdmin();
  return (
    <AppShell>
      <div className="admin-page">
        <header className="admin-heading">
          <p className="auth-kicker">ADMINISTRAÇÃO · FASE 2A</p>
          <h1>Cuidar de cada começo.</h1>
          <p>Este é o ponto de partida da operação da AMAR.IA.</p>
          <Link href="/minha-conta" className="auth-text-link">
            Minha conta <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </header>
        <div className="admin-grid">
          <section className="admin-tile">
            <ShieldCheck size={26} aria-hidden="true" />
            <h2>Acesso protegido</h2>
            <p>
              Identidade e sessão verificadas no servidor. Sua permissão de
              administrador está ativa.
            </p>
          </section>
          <section className="admin-tile">
            <KeyRound size={26} aria-hidden="true" />
            <h2>Equipe por convite</h2>
            <p>
              Novas contas públicas permanecem desativadas. As permissões são
              gerenciadas fora do aplicativo.
            </p>
          </section>
          <section className="admin-tile">
            <BookHeart size={26} aria-hidden="true" />
            <h2>Curadoria editorial</h2>
            <p>
              A gestão de conteúdos é a próxima etapa. O feed atual continua com
              as prévias editoriais da Fase 1.
            </p>
            <Link className="auth-text-link" href="/">
              Ver o feed <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </section>
        </div>
        <section className="admin-next">
          <span className="small-pill">PRÓXIMA ETAPA</span>
          <h2>Dar vida à curadoria.</h2>
          <p>
            Organizar temas, rascunhos e revisões antes de habilitar a
            publicação de conteúdos pelo painel. Chat, comunidade e assinaturas
            ainda não estão disponíveis.
          </p>
        </section>
        <p className="admin-session">
          Sessão de {account.email}. Não compartilhe seu acesso.
        </p>
      </div>
    </AppShell>
  );
}
