import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFrame, AuthUnavailable } from "@/components/auth/auth-frame";
import { AuthForm } from "@/components/auth/auth-form";
import { authIsConfigured, getAccount } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Seja membro",
  description:
    "Crie gratuitamente seu perfil AMARIA e acesse as leituras completas.",
  alternates: { canonical: "/cadastro" },
  robots: { index: false, follow: true },
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const configured = authIsConfigured();
  const { next } = await searchParams;
  if (configured && (await getAccount())) redirect("/meu-perfil");
  return (
    <AuthFrame
      activeMode="signup"
      eyebrow="MEMBRO FUNDADORA"
      title="Um espaço inteiro para você."
      description="Crie seu perfil gratuito para continuar todas as leituras, comentar e participar dos próximos capítulos da AMARIA."
    >
      {configured ? (
        <AuthForm mode="signup" next={next} />
      ) : (
        <AuthUnavailable />
      )}
    </AuthFrame>
  );
}
