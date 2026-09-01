import type { Metadata } from "next";
import Link from "next/link";
import { AuthFrame } from "@/components/auth/auth-frame";

export const metadata: Metadata = {
  title: "Link de acesso inválido",
  robots: { index: false, follow: false },
};

export default function InvalidLinkPage() {
  return (
    <AuthFrame
      title="Vamos tentar com um novo link."
      description="Este link pode ter expirado ou já ter sido usado. Abra o e-mail mais recente no mesmo navegador em que você pediu a recuperação."
    >
      <div className="auth-form">
        <Link
          href="/recuperar-acesso"
          className="button button-primary auth-submit"
        >
          Solicitar outro link
        </Link>
        <p className="auth-form-note">
          Se este é seu primeiro acesso e você ainda não confirmou o convite,
          peça o reenvio à administração.
        </p>
        <Link href="/entrar" className="auth-text-link">
          Voltar para entrar
        </Link>
      </div>
    </AuthFrame>
  );
}
