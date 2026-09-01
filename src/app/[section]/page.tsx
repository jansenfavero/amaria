import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookHeart,
  Headphones,
  Heart,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { site } from "@/lib/site";

const sections = {
  sobre: {
    title: "O que é AMARIA?",
    eyebrow: "AMAR + INTELIGÊNCIA ARTIFICIAL",
    heading: "Para amar sem se perder de você.",
    description:
      "Um espaço de inteligência relacional para mulheres. A AMARIA nasce do encontro entre conhecimento, tecnologia e conexão humana — com respeito à singularidade de cada história.",
    icon: Heart,
  },
  maria: {
    title: "Conselheira Maria",
    eyebrow: "UMA NOVA FORMA DE REFLETIR · EM DESENVOLVIMENTO",
    heading: "Uma conversa. Novas perspectivas.",
    description:
      "Maria é a proposta de uma conselheira com inteligência artificial para apoiar reflexões sobre a sua vida relacional. Um espaço pensado para conversar sobre vínculos e escolhas, no seu tempo.",
    icon: Sparkles,
  },
  podcasts: {
    title: "Áudios & podcasts",
    eyebrow: "PALAVRAS PARA OUVIR · EM PREPARAÇÃO",
    heading: "Reflexões que acompanham o seu ritmo.",
    description:
      "Estamos preparando a proposta de áudios e podcasts sobre amor-próprio, limites, relacionamentos e recomeços. Para levar boas conversas com você, onde fizer sentido.",
    icon: Headphones,
  },
  comunidade: {
    title: "Comunidade",
    eyebrow: "CONEXÕES REAIS · EM BREVE",
    heading: "Histórias diferentes. Um lugar em comum.",
    description:
      "Uma comunidade exclusiva para mulheres, pensada para trocas respeitosas, aprendizados e conexão. Um lugar em que compartilhar não seja uma obrigação e cada história encontre respeito.",
    icon: UsersRound,
  },
  curadoria: {
    title: "Nossa curadoria",
    eyebrow: "CONHECIMENTO COM RESPONSABILIDADE",
    heading: "Cuidado também é escolher como conversar.",
    description:
      "A AMARIA conta com curadoria psicológica para orientar conteúdos, metodologia e limites de segurança da plataforma.",
    icon: BookHeart,
  },
  privacidade: {
    title: "Privacidade & cuidado",
    eyebrow: "TRANSPARÊNCIA DESDE O COMEÇO",
    heading: "Seu espaço. A sua história.",
    description:
      "A AMARIA está em pré-lançamento. Saiba como funciona a prévia pública e o acesso restrito da equipe, antes da abertura de contas ao público, conversas e comunidade.",
    icon: ShieldCheck,
  },
};
type Section = keyof typeof sections;
function isSection(value: string): value is Section {
  return Object.hasOwn(sections, value);
}
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  if (!isSection(section)) return {};
  return {
    title: sections[section].title,
    description: sections[section].description,
    alternates: { canonical: `/${section}` },
  };
}
export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!isSection(section)) notFound();
  const content = sections[section];
  const Icon = content.icon;
  return (
    <AppShell>
      <div className="info-page">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} aria-hidden="true" /> Voltar para o seu feed
        </Link>
        <header className="info-hero">
          <span className="info-icon">
            <Icon size={28} strokeWidth={1.3} aria-hidden="true" />
          </span>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.heading}</h1>
          <p className="info-description">{content.description}</p>
          <span className="info-watermark" aria-hidden="true">
            AMARIA
          </span>
        </header>
        {section === "sobre" ? (
          <>
            <section className="info-section">
              <p className="eyebrow">TRÊS FORMAS DE SE REENCONTRAR</p>
              <div className="pillar-grid">
                {[
                  {
                    title: "Conteúdo que aproxima",
                    copy: "Reflexões e, futuramente, áudios e podcasts para olhar com mais atenção para a sua vida relacional.",
                    href: "/podcasts",
                    icon: BookHeart,
                  },
                  {
                    title: "Conselheira Maria",
                    copy: "Uma IA em desenvolvimento para apoiar conversas e reflexões, com limites claros e cuidado com a sua privacidade.",
                    href: "/maria",
                    icon: Sparkles,
                  },
                  {
                    title: "Conexões entre mulheres",
                    copy: "Uma comunidade em preparação para trocar experiências, aprender e construir novos vínculos.",
                    href: "/comunidade",
                    icon: UsersRound,
                  },
                ].map(({ title, copy, href, icon: PillarIcon }) => (
                  <Link className="info-tile" href={href} key={href}>
                    <PillarIcon size={24} aria-hidden="true" />
                    <h2>{title}</h2>
                    <p>{copy}</p>
                    <span>
                      Conheça a proposta{" "}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
            <div className="info-callout">
              <Image
                src="/brand/emblem.webp"
                alt="Símbolo da AMARIA em fita rosa e roxa."
                width={104}
                height={104}
              />
              <div>
                <h2>
                  Feita para mulheres.
                  <br />
                  <em>Pensada para a sua história.</em>
                </h2>
                <p>
                  Amor-próprio, limites saudáveis, relacionamentos e recomeços:
                  nossos primeiros temas para abrir conversas que importam.
                </p>
              </div>
            </div>
          </>
        ) : null}
        {section === "curadoria" ? (
          <section className="info-section">
            <div className="curator-grid">
              {[
                { name: "Léa Fávero", initials: "LF" },
                { name: "Juciane Carneiro", initials: "JC" },
              ].map((person) => (
                <article className="curator-card" key={person.name}>
                  <span className="curator-initials" aria-hidden="true">
                    {person.initials}
                  </span>
                  <div>
                    <h2>{person.name}</h2>
                    <p>Psicóloga · Especialista em EMDR</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="info-text">
              <h2>Curadoria técnico-científica.</h2>
              <p>
                Léa Fávero e Juciane Carneiro orientam a curadoria psicológica
                da AMARIA, com atenção à linguagem, aos limites de segurança e à
                responsabilidade dos conteúdos relacionais.
              </p>
              <p>
                Este conteúdo tem caráter informativo e educativo e não
                substitui acompanhamento psicológico ou atendimento profissional
                em saúde mental. A especialização das curadoras não transforma a
                AMARIA em psicoterapia ou ferramenta de EMDR.
              </p>
            </div>
          </section>
        ) : null}
        {section === "maria" ? (
          <section className="info-section info-text">
            <h2>Antes da primeira conversa, o cuidado.</h2>
            <p>
              O chat ainda não está ativo. A próxima etapa exige autenticação,
              consentimento e proteção das conversas antes de disponibilizar
              qualquer interação real.
            </p>
            <div className="safety-note">
              <ShieldCheck size={24} aria-hidden="true" />
              <p>
                Maria não é psicóloga, serviço de emergência ou substituta de
                acompanhamento profissional. Não fará diagnósticos nem oferecerá
                psicoterapia ou EMDR.
              </p>
            </div>
          </section>
        ) : null}
        {section === "podcasts" ? (
          <section className="info-section info-text">
            <h2>Uma pausa para escutar.</h2>
            <p>
              Os episódios e a biblioteca de áudios ainda estão em preparação.
              Não há reprodução, assinatura ou cobrança disponível nesta versão.
            </p>
            <p>
              Enquanto isso, conheça os temas iniciais no feed e leve uma
              reflexão para o seu dia.
            </p>
            <Link href="/#temas" className="button button-primary">
              Explorar os temas <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </section>
        ) : null}
        {section === "comunidade" ? (
          <section className="info-section info-text">
            <h2>O pertencimento começa pelo respeito.</h2>
            <p>
              Antes de abrir a comunidade, precisamos preparar contas,
              privacidade, regras de convivência, moderação e formas de
              denunciar conteúdos.
            </p>
            <p>
              Publicações de usuárias e comentários ainda não estão ativos.
              Nesta versão, nenhuma mensagem ou relato pessoal é coletado.
            </p>
            <div className="safety-note">
              <Heart size={24} aria-hidden="true" />
              <p>
                As curtidas ficam apenas no seu dispositivo e não representam
                atividade de outras pessoas. Comentários públicos ainda não são
                coletados.
              </p>
            </div>
          </section>
        ) : null}
        {section === "privacidade" ? (
          <section className="info-section info-text">
            <h2>O que acontece nesta versão</h2>
            <ul>
              <li>
                As curtidas ficam na memória desta página e desaparecem ao
                recarregar ou sair dela. Não são enviadas ao Supabase.
              </li>
              <li>
                O compartilhamento usa os recursos do seu navegador ou copia o
                link. A AMARIA não publica por você.
              </li>
              <li>
                Não há cadastro público, chat, campo de comentários,
                rastreadores de publicidade ou analytics instalados na
                aplicação.
              </li>
              <li>
                A hospedagem pode processar dados técnicos de acesso, como
                endereço IP, para servir e proteger o site.
              </li>
            </ul>
            <h2 id="equipe">Acesso restrito da equipe</h2>
            <p>
              Versão do aviso: equipe-2026-08-31. Apenas pessoas convidadas
              podem usar a área de conta. O feed público não exige login.
            </p>
            <p>
              Para esse acesso, o Supabase Auth processa e-mail, credenciais de
              autenticação e sessões. A aplicação consulta o e-mail confirmado e
              registra o perfil de permissão, se o acesso está ativo e a versão
              e data de leitura deste aviso. Senhas não são armazenadas nas
              tabelas da aplicação nem exibidas à equipe.
            </p>
            <p>
              Cookies de sessão são necessários para manter o login e proteger
              as áreas restritas. Não são usados para publicidade. A hospedagem
              e o serviço de autenticação podem processar registros técnicos
              para operação e segurança. Não envie relatos pessoais ou dados
              sensíveis por esses formulários.
            </p>
            <p>
              As permissões são mantidas pela administração; cada conta só pode
              consultar seus próprios registros de acesso e leitura do aviso. Os
              dados são mantidos enquanto necessários ao acesso da equipe.
              Solicite correção, revogação de acesso ou exclusão à administração
              pelo canal usado para o seu convite. Após confirmar a identidade,
              a administração trata a solicitação; registros de segurança e
              cópias de backup seguem os prazos dos respectivos provedores.
            </p>
            <h2>Antes de abrir novas funcionalidades</h2>
            <p>
              Será necessário disponibilizar os avisos de privacidade e termos
              aplicáveis, canais para exercer direitos, consentimento quando
              necessário e regras de retenção e exclusão de dados.
            </p>
            <p>
              Este é um aviso sobre a prévia atual, não a política definitiva de
              uma comunidade em funcionamento.
            </p>
          </section>
        ) : null}
        <footer className="info-footer">
          <span>AMARIA · CONTEÚDO, MARIA E COMUNIDADE</span>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            @amaria.club <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </AppShell>
  );
}
