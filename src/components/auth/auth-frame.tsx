import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthFrame({
  eyebrow = "SEU ESPAÇO AMARIA",
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
        <Link href="/" className="auth-home-mark" aria-label="AMARIA — página inicial">
          <Image src="/brand/emblem.webp" alt="" width={42} height={42} />
          <span>AMARIA</span>
        </Link>
        <div className="auth-header-actions">
          <ThemeToggle compact />
          <Link href="/" className="auth-back" aria-label="Voltar ao início">
            <ArrowLeft size={18} aria-hidden="true" />
            <span>Voltar ao início</span>
          </Link>
        </div>
      </header>
      <main id="conteudo-principal" className="auth-main">
        <aside className="auth-story" aria-label="Nossa essência">
          <Image
            src="/membership/founder-invitation.webp"
            alt="Mulher lendo conteúdos da AMARIA pelo smartphone"
            fill
            priority
            className="auth-story-image"
            sizes="(max-width: 760px) calc(100vw - 32px), 48vw"
          />
          <span className="auth-story-shade" aria-hidden="true" />
          <div className="auth-story-copy">
          <Image
            src="/brand/logo-horizontal.png"
            alt="AMARIA"
            width={636}
            height={207}
            className="auth-story-logo"
          />
          <span className="auth-kicker">INTELIGÊNCIA RELACIONAL FEMININA</span>
          <p className="auth-motto">
            Para amar sem
            <br />
            se perder <em>de você.</em>
          </p>
          <p>
            Leituras para reconhecer padrões, organizar escolhas e voltar a se
            escutar — no seu tempo.
          </p>
          <span className="auth-story-note">
            <ShieldCheck size={19} aria-hidden="true" /> Perfil gratuito ·
            privacidade por princípio
          </span>
          </div>
        </aside>
        <section className="auth-card" aria-labelledby="auth-title">
          <p className="auth-kicker">{eyebrow}</p>
          <h1 id="auth-title">{title}</h1>
          <p className="auth-description">{description}</p>
          {children}
        </section>
      </main>
      <footer className="auth-footer">
        <span>AMARIA · Feita de cuidado.</span>
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
