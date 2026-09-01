import type { Metadata } from "next";
import { AuthFrame, AuthUnavailable } from "@/components/auth/auth-frame";
import { ReceiveLink } from "@/components/auth/receive-link";
import { authIsConfigured } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Confirmar acesso",
  robots: { index: false, follow: false },
};

export default function ReceivePage() {
  return (
    <AuthFrame
      title="Seu próximo passo começa aqui."
      description="Confirme o link recebido por e-mail para definir sua senha e continuar."
    >
      {authIsConfigured() ? <ReceiveLink /> : <AuthUnavailable />}
    </AuthFrame>
  );
}
