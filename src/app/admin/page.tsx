import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenText,
  Eye,
  Heart,
  MessageCircleHeart,
  Share2,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AdminNav } from "@/components/admin/admin-nav";
import { PageHero } from "@/components/page-hero";
import { requireAdmin } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Painel administrativo",
  robots: { index: false, follow: false },
};

type Metrics = {
  site_views: number;
  article_views: number;
  members: number;
  new_members_30d: number;
  founder_members: number;
  likes: number;
  shares: number;
  comments: number;
  top_articles: { slug: string; views: number }[];
  daily_views: { day: string; views: number }[];
};

const emptyMetrics: Metrics = {
  site_views: 0,
  article_views: 0,
  members: 0,
  new_members_30d: 0,
  founder_members: 0,
  likes: 0,
  shares: 0,
  comments: 0,
  top_articles: [],
  daily_views: [],
};

export default async function AdminPage() {
  const account = await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.rpc("admin_dashboard_metrics");
  const metrics = (data as Metrics | null) ?? emptyMetrics;
  const maxDaily = Math.max(...metrics.daily_views.map((item) => item.views), 1);

  const cards = [
    { label: "Visualizações do site", value: metrics.site_views, icon: Eye },
    { label: "Leituras de artigos", value: metrics.article_views, icon: BookOpenText },
    { label: "Membros ativas", value: metrics.members, icon: UsersRound },
    { label: "Novas em 30 dias", value: metrics.new_members_30d, icon: Sparkles },
    { label: "Curtidas", value: metrics.likes, icon: Heart },
    { label: "Compartilhamentos", value: metrics.shares, icon: Share2 },
    { label: "Comentários", value: metrics.comments, icon: MessageCircleHeart },
  ];

  return (
    <AppShell>
      <div className="admin-page admin-dashboard">
        <PageHero
          eyebrow="PAINEL AMARIA"
          title="Visão geral da plataforma."
          description="Acompanhe alcance, comunidade e participação para orientar os próximos movimentos editoriais."
          image="/membership/founder-invitation.webp"
          imageAlt="Mulher acessando a AMARIA pelo smartphone"
          compact
        >
          <span className="admin-identity">Sessão segura · {account.email}</span>
        </PageHero>
        <AdminNav />

        <section className="metric-grid" aria-label="Métricas principais">
          {cards.map(({ label, value, icon: Icon }) => (
            <article className="metric-card" key={label}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
              <strong>{new Intl.NumberFormat("pt-BR").format(value)}</strong>
            </article>
          ))}
        </section>

        <div className="admin-insight-grid">
          <section className="admin-panel-card">
            <div className="admin-panel-heading">
              <div>
                <span className="eyebrow">ÚLTIMOS 14 DIAS</span>
                <h2>Ritmo de visualizações</h2>
              </div>
            </div>
            {metrics.daily_views.length ? (
              <div className="metrics-chart" aria-label="Visualizações por dia">
                {metrics.daily_views.map((item) => (
                  <div key={item.day}>
                    <span
                      style={{
                        height: `${Math.max(8, (item.views / maxDaily) * 100)}%`,
                      }}
                      title={`${item.views} visualizações`}
                    />
                    <small>
                      {new Intl.DateTimeFormat("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                      }).format(new Date(`${item.day}T12:00:00Z`))}
                    </small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-empty">Os primeiros acessos aparecerão aqui.</p>
            )}
          </section>

          <section className="admin-panel-card founder-progress-card">
            <span className="eyebrow">MEMBROS FUNDADORAS</span>
            <h2>{metrics.founder_members} de 100</h2>
            <div className="founder-progress">
              <span style={{ width: `${Math.min(metrics.founder_members, 100)}%` }} />
            </div>
            <p>
              Acompanhe a entrada das 100 primeiras mulheres com benefícios
              exclusivos.
            </p>
            <Link href="/admin/membros">
              Ver membros <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </section>
        </div>

        <section className="admin-panel-card">
          <div className="admin-panel-heading">
            <div>
              <span className="eyebrow">INTERESSE EDITORIAL</span>
              <h2>Artigos mais visualizados</h2>
            </div>
            <Link href="/admin/conteudos">Gerenciar conteúdos</Link>
          </div>
          {metrics.top_articles.length ? (
            <ol className="top-articles">
              {metrics.top_articles.map((item) => (
                <li key={item.slug}>
                  <Link href={`/conteudos/${item.slug}`}>{item.slug.replaceAll("-", " ")}</Link>
                  <strong>{item.views} leituras</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p className="admin-empty">
              As leituras serão consolidadas conforme o público navegar.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
