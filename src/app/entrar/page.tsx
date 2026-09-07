import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFrame, AuthUnavailable } from "@/components/auth/auth-frame";
import { AuthForm } from "@/components/auth/auth-form";
import { authIsConfigured, getAccount } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string; next?: string }>;
}) {
  const configured = authIsConfigured();
  if (configured && (await getAccount())) redirect("/meu-perfil");
  const { aviso, next } = await searchParams;
  const message =
    aviso === "senha-atualizada"
      ? "Senha atualizada. Entre com sua nova senha."
      : aviso === "sessao-encerrada"
        ? "Você saiu da sua conta com segurança."
        : null;
  return (
    <AuthFrame
      activeMode="login"
      eyebrow="SEU PERFIL"
      title="Que bom ter você aqui."
      description="Entre para continuar suas leituras, comentar e acompanhar seu espaço na AMARIA."
    >
      {message ? (
        <p className="auth-message auth-message-success" role="status">
          {message}
        </p>
      ) : null}
      {configured ? <AuthForm mode="login" next={next} /> : <AuthUnavailable />}
    </AuthFrame>
  );
}
