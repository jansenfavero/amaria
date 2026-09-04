import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, UserRound, CalendarDays, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getAccount } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { MemberRegisterForm } from "@/components/membership/member-register-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Seja Membro",
  description: "Cadastre-se como membro gratuito da AMARIA e tenha acesso a conteúdos completos e comunidade.",
};

export default async function BecomeMemberPage() {
  const account = await getAccount();
  
  // Get member profile if exists
  let memberProfile = null;
  if (account) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("member_profiles")
      .select("*")
      .eq("user_id", account.id)
      .single();
    memberProfile = data;
  }

  return (
    <AppShell>
      <div className="become-member-page">
        <header className="become-member-hero">
          <p className="page-eyebrow">COMUNIDADE AMARIA</p>
          <h1>Seja membro gratuito da AMARIA</h1>
          <p className="hero-description">
            Junte-se a mulheres que buscam autoconhecimento, relacionamentos 
            mais saudáveis e inteligência relacional.
          </p>
        </header>

        {memberProfile ? (
          <section className="already-member-section">
            <div className="member-card">
              <UserRound size={48} />
              <h2>Você já é membro!</h2>
              <p>Bem-vinda de volta, <strong>{memberProfile.display_name}</strong>.</p>
              {memberProfile.is_founding_member && (
                <div className="founding-badge">
                  <Sparkles size={16} />
                  <span>Membro Fundadora #{memberProfile.founding_number}</span>
                </div>
              )}
              <Link href="/meu-perfil" className="button button-primary">
                Ir para Meu Perfil <ArrowRight size={18} />
              </Link>
            </div>
          </section>
        ) : (
          <div className="member-register-layout">
            <div className="register-form-column">
              <MemberRegisterForm account={account} />
            </div>

            <aside className="benefits-sidebar">
              <h3>Benefícios de ser membro</h3>
              
              <div className="benefit-card">
                <Sparkles size={24} />
                <div>
                  <strong>Acesso completo aos artigos</strong>
                  <p>Leia 100% dos conteúdos após os primeiros 20% gratuitos.</p>
                </div>
              </div>

              <div className="benefit-card">
                <UserRound size={24} />
                <div>
                  <strong>Comente e participe</strong>
                  <p>Interaja com os artigos e compartilhe suas reflexões com a comunidade.</p>
                </div>
              </div>

              <div className="benefit-card">
                <CalendarDays size={24} />
                <div>
                  <strong>Eventos exclusivos</strong>
                  <p>Participe de encontros virtuais e presenciais com outras membros.</p>
                </div>
              </div>

              <div className="benefit-card highlight">
                <Sparkles size={24} />
                <div>
                  <strong>Maria - Conselheira IA</strong>
                  <p>Em breve: uma inteligência artificial para organizar seus pensamentos sobre relacionamentos.</p>
                </div>
              </div>

              <div className="founding-callout">
                <h4>Seja uma das 100 primeiras</h4>
                <p>Membros fundadoras têm benefícios exclusivos, incluindo acesso antecipado a novos recursos e participação em decisões da comunidade.</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </AppShell>
  );
}
