import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { AuthForm } from "@/components/auth/auth-form";
import { requireAccount } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Definir senha",
  robots: { index: false, follow: false },
};

export default async function SetPasswordPage() {
  await requireAccount();
  return (
    <AuthFrame
      title="Um acesso só seu."
      description="Defina uma senha segura para proteger sua conta da equipe."
    >
      <AuthForm mode="password" />
    </AuthFrame>
  );
}
