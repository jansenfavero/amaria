import type { Metadata } from "next";
import { AuthFrame, AuthUnavailable } from "@/components/auth/auth-frame";
import { AuthForm } from "@/components/auth/auth-form";
import { authIsConfigured } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Recuperar acesso",
  robots: { index: false, follow: false },
};

export default function RecoverPage() {
  return (
    <AuthFrame
      title="Vamos recuperar seu acesso."
      description="Informe o e-mail da sua conta para solicitar um link de recuperação."
    >
      {authIsConfigured() ? <AuthForm mode="recover" /> : <AuthUnavailable />}
    </AuthFrame>
  );
}
