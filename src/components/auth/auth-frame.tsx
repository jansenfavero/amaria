import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/brand";

export function AuthFrame({
  eyebrow = "ACESSO DA EQUIPE",
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="auth-shell">
      <header className="auth-header">
        <Brand />
        <Link href="/" className="auth-back" aria-label="Voltar ao início">
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Voltar ao início</span>
        </Link>
      </header>
      <main id="conteudo-principal" className="auth-main">
        <aside className="auth-story" aria-label="Nossa essência">
          <span className="auth-kicker">INTELIGÊNCIA RELACIONAL</span>
          <Image
            src="/brand/logo-horizontal.png"
            alt="AMAR.IA"
            width={636}
            height={207}
            className="auth-story-logo"
          />
          <p className="auth-motto">
            Para amar sem
            <br />
            se perder <em>de você.</em>
          </p>
          <p>
            Um espaço em construção, com cuidado em cada detalhe. Começando por
            quem faz tudo acontecer.
          </p>
          <span className="auth-story-note">
            <ShieldCheck size={19} aria-hidden="true" /> Pré-lançamento · acesso
            por convite
          </span>
        </aside>
        <section className="auth-card" aria-labelledby="auth-title">
          <p className="auth-kicker">{eyebrow}</p>
          <h1 id="auth-title">{title}</h1>
          <p className="auth-description">{description}</p>
          {children}
        </section>
      </main>
      <footer className="auth-footer">
        <span>AMAR.IA · Feita de cuidado.</span>
        <Link href="/privacidade">Privacidade & cuidado</Link>
      </footer>
    </div>
  );
}

export function AuthUnavailable() {
  return (
    <p className="auth-message auth-message-error" role="status">
      O acesso está em configuração. Tente novamente mais tarde. O feed continua
      disponível.
    </p>
  );
}
