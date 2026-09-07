import type { Metadata } from "next";
import { Crown, UsersRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AdminNav } from "@/components/admin/admin-nav";
import { PageHero } from "@/components/page-hero";
import { requireAdmin } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Membros | Administração",
  robots: { index: false, follow: false },
};

export default async function MembersPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("member_profiles")
    .select("id, display_name, email, founder_number, marketing_opt_in, created_at")
    .order("created_at", { ascending: false });

  return (
    <AppShell>
      <div className="admin-page">
        <PageHero
          eyebrow="COMUNIDADE"
          title="Membros da AMARIA."
          description="Um diretório privado para acompanhar quem está chegando."
          image="/membership/founder-invitation.webp"
          imageAlt="Mulher conectada à comunidade AMARIA"
          compact
        />
        <AdminNav />
        <section className="admin-panel-card">
          <div className="admin-panel-heading">
            <div>
              <span className="eyebrow"><UsersRound aria-hidden="true" /> PERFIS CONFIRMADOS E PENDENTES</span>
              <h2>{profiles?.length ?? 0} cadastros</h2>
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Membro</th><th>Fundadora</th><th>Novidades</th><th>Cadastro</th></tr></thead>
              <tbody>
                {profiles?.length ? profiles.map((profile) => (
                  <tr key={profile.id}>
                    <td><strong>{profile.display_name || "Nome não informado"}</strong><small>{profile.email}</small></td>
                    <td>{profile.founder_number ? <span className="founder-table-badge"><Crown aria-hidden="true" /> #{profile.founder_number}</span> : "—"}</td>
                    <td>{profile.marketing_opt_in ? "Aceitou" : "Não aceitou"}</td>
                    <td>{new Intl.DateTimeFormat("pt-BR").format(new Date(profile.created_at))}</td>
                  </tr>
                )) : <tr><td colSpan={4} className="admin-empty">Nenhuma membro cadastrada ainda.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
