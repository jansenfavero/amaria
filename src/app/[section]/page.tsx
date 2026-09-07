import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  BookHeart,
  Headphones,
  Heart,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/site";

const sections = {
  sobre: {
    title: "O que é AMARIA?",
    eyebrow: "AMAR + INTELIGÊNCIA ARTIFICIAL",
    heading: "Para amar sem se perder de você.",
    description:
      "Um espaço de inteligência relacional para mulheres. A AMARIA nasce do encontro entre conhecimento, tecnologia e conexão humana — com respeito à singularidade de cada história.",
    image: "/editorial/amor-proprio.webp",
    icon: Heart,
  },
  maria: {
    title: "Conselheira Maria",
    eyebrow: "UMA NOVA FORMA DE REFLETIR · EM DESENVOLVIMENTO",
    heading: "Uma conversa. Novas perspectivas.",
    description:
      "Maria é a proposta de uma conselheira com inteligência artificial para apoiar reflexões sobre a sua vida relacional. Um espaço pensado para conversar sobre vínculos e escolhas, no seu tempo.",
    image: "/membership/founder-invitation.webp",
    icon: Sparkles,
  },
  podcasts: {
    title: "Áudios & podcasts",
    eyebrow: "PALAVRAS PARA OUVIR · EM PREPARAÇÃO",
    heading: "Reflexões que acompanham o seu ritmo.",
    description:
      "Estamos preparando a proposta de áudios e podcasts sobre amor-próprio, limites, relacionamentos e recomeços. Para levar boas conversas com você, onde fizer sentido.",
    image: "/editorial/recomecos.webp",
    icon: Headphones,
  },
  comunidade: {
    title: "Comunidade",
    eyebrow: "CONEXÕES REAIS · EM BREVE",
    heading: "Histórias diferentes. Um lugar em comum.",
    description:
      "Uma comunidade exclusiva para mulheres, pensada para trocas respeitosas, aprendizados e conexão. Um lugar em que compartilhar não seja uma obrigação e cada história encontre respeito.",
    image: "/editorial/relacionamentos.webp",
    icon: UsersRound,
  },
  curadoria: {
    title: "Nossa curadoria",
    eyebrow: "CONHECIMENTO COM RESPONSABILIDADE",
    heading: "Cuidado também é escolher como conversar.",
    description:
      "A AMARIA conta com curadoria psicológica para orientar conteúdos, metodologia e limites de segurança da plataforma.",
    image: "/editorial/amor-proprio.webp",
    icon: BookHeart,
  },
  privacidade: {
    title: "Privacidade & cuidado",
    eyebrow: "TRANSPARÊNCIA DESDE O COMEÇO",
    heading: "Seu espaço. A sua história.",
    description:
      "Conheça os dados necessários para seu perfil, leituras e interações, além das escolhas disponíveis para você.",
    image: "/editorial/limites.webp",
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
  return (
    <AppShell>
      <div className="info-page">
        <PageHero
          backHref="/"
          backLabel="Voltar para o seu feed"
          eyebrow={content.eyebrow}
          title={content.heading}
          description={content.description}
          image={content.image}
          imageAlt="Mulher em um momento de reflexão"
        />
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
              Os perfis de membros e os comentários nos artigos já contam com
              autenticação, privacidade e moderação. A comunidade ampla ainda
              será aberta somente depois de concluirmos regras de convivência,
              denúncias e ferramentas adicionais de proteção.
            </p>
            <p>
              Publicações entre membros ainda não estão ativas. Nos artigos,
              membros podem comentar de forma opcional e respeitosa.
            </p>
            <div className="safety-note">
              <Heart size={24} aria-hidden="true" />
              <p>
                Comentários são públicos depois de publicados, mas escrever
                exige um perfil confirmado. Nunca compartilhe informações
                sensíveis de terceiros.
              </p>
            </div>
          </section>
        ) : null}
        {section === "privacidade" ? (
          <section className="info-section info-text">
            <h2>O que acontece nesta versão</h2>
            <ul>
              <li>
                Visualizações, curtidas e compartilhamentos são contabilizados
                com um identificador aleatório do navegador. A aplicação não
                armazena IP nem agente do navegador nessas tabelas de métricas.
              </li>
              <li>
                O compartilhamento usa os recursos do seu navegador ou copia o
                link. A AMARIA não publica por você.
              </li>
              <li>
                O cadastro gratuito processa nome, e-mail, credencial,
                confirmação de privacidade e preferência de novidades.
                Comentários opcionais ficam associados ao perfil.
              </li>
              <li>
                Google AdSense, Vercel e Supabase podem processar dados técnicos
                conforme suas próprias políticas para publicidade, hospedagem,
                autenticação e segurança.
              </li>
            </ul>
            <h2 id="equipe">Perfis de membros e administração</h2>
            <p>
              Versão do aviso para membros: membros-2026-09-03. Qualquer pessoa
              com acesso ao próprio e-mail pode solicitar cadastro; o conteúdo
              completo e os comentários exigem confirmação.
            </p>
            <p>
              O Supabase Auth processa e-mail, credenciais e sessões. Senhas não
              são armazenadas nas tabelas editoriais nem exibidas à equipe. O
              papel administrativo é definido no banco e não pode ser alterado
              pelo próprio perfil.
            </p>
            <p>
              Cookies de sessão mantêm o login e protegem áreas restritas. Um
              cookie técnico separado mantém o identificador aleatório das
              métricas e curtidas. O Google pode utilizar tecnologias próprias
              nos espaços de anúncio exibidos dentro de artigos.
            </p>
            <p>
              Cada membro pode editar o próprio nome e preferência de contato em
              “Meu Perfil”. A exclusão definitiva da conta também está
              disponível nessa tela e remove perfil, acesso e comentários
              associados; registros técnicos e backups seguem os prazos dos
              provedores.
            </p>
            <h2>Funcionalidades ainda em preparação</h2>
            <p>
              Maria e a comunidade interativa permanecem identificadas como “em
              breve”. Antes da abertura, receberão avisos e controles
              específicos para conversas, segurança e retenção.
            </p>
            <p>
              Para dúvidas ou exercício de direitos, escreva para
              contato@jansenfavero.com.
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
