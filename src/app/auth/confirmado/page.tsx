import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { AuthFrame } from "@/components/auth/auth-frame";
import { safeAuthDestination } from "@/lib/auth/policy";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "E-mail confirmado",
  robots: { index: false, follow: false },
};

export default async function ConfirmedEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const destination = safeAuthDestination(next);

  return (
    <AuthFrame
      eyebrow="PERFIL ATIVADO"
      title="Seu e-mail foi confirmado."
      description="Seu espaço AMARIA está pronto. Agora você pode continuar todas as leituras, comentar e acompanhar suas interações."
    >
      <div className="auth-confirmed-panel">
        <BadgeCheck size={32} aria-hidden="true" />
        <div>
          <strong>Que bom ter você por aqui.</strong>
          <p>A confirmação foi concluída com segurança.</p>
        </div>
      </div>
      <Link href={destination} className="button button-primary auth-submit">
        Continuar na AMARIA <ArrowRight size={19} aria-hidden="true" />
      </Link>
    </AuthFrame>
  );
}
