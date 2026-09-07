import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthFrame({
  eyebrow = "SEU ESPAÇO AMARIA",
  title,
  description,
  activeMode,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  activeMode?: "login" | "signup";
  children: React.ReactNode;
}) {
  return (
    <div className="auth-shell">
      <header className="auth-header">
        <Link
          href="/"
          className="auth-home-mark"
          aria-label="AMARIA — página inicial"
        >
          <Image
            src="/brand/logo-horizontal.png"
            alt="AMARIA"
            width={636}
            height={207}
            className="auth-home-logo"
            priority
          />
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
          <div className="auth-story-media">
            <Image
              src="/membership/founder-invitation.webp"
              alt="Mulher lendo conteúdos da AMARIA pelo smartphone"
              fill
              priority
              className="auth-story-image"
              sizes="(max-width: 760px) calc(100vw - 32px), 540px"
            />
            <span className="auth-story-shade" aria-hidden="true" />
          </div>
          <div className="auth-story-copy">
            <span className="auth-kicker">
              INTELIGÊNCIA RELACIONAL FEMININA
            </span>
            <p className="auth-motto">
              Para amar sem se perder <em>de você.</em>
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
          {activeMode ? (
            <nav className="auth-mode-switch" aria-label="Acesso à AMARIA">
              <Link
                href="/entrar"
                aria-current={activeMode === "login" ? "page" : undefined}
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                aria-current={activeMode === "signup" ? "page" : undefined}
              >
                Criar conta
              </Link>
            </nav>
          ) : null}
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
