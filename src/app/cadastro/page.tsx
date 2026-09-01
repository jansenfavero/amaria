import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Cadastro gratuito",
  description: "Acompanhe a abertura das contas gratuitas da AMAR.IA.",
  alternates: { canonical: "/cadastro" },
  robots: { index: false, follow: true },
};

export default function SignupPage() {
  return (
    <AppShell>
      <div className="signup-page">
        <Link href="/conteudos" className="back-link">
          <ArrowLeft size={16} /> Voltar aos conteúdos
        </Link>
        <section className="signup-card">
          <span className="signup-icon">
            <Sparkles aria-hidden="true" />
          </span>
          <p className="eyebrow">CONTAS GRATUITAS · EM PREPARAÇÃO</p>
          <h1>Seu espaço na AMAR.IA está chegando.</h1>
          <p>
            A leitura dos artigos já é pública e não exige conta. Antes de abrir
            cadastros, estamos concluindo as proteções de privacidade e a
            experiência para guardar reflexões com segurança.
          </p>
          <a
            href="mailto:contato@jansenfavero.com?subject=Quero%20acompanhar%20a%20abertura%20da%20AMAR.IA"
            className="button button-primary"
          >
            <Mail size={17} /> Quero receber o aviso
          </a>
          <div className="signup-note">
            <ShieldCheck aria-hidden="true" />
            <p>
              Nenhum cadastro é coletado nesta página. O botão abre seu
              aplicativo de e-mail para que você escolha se deseja entrar em
              contato.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
