import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Headphones,
  Heart,
  Camera,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { Header } from "@/components/header";
import { site } from "@/lib/site";

const topics = [
  "Amor-próprio",
  "Limites saudáveis",
  "Relacionamentos",
  "Recomeços",
];

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo-principal">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="small-star">✦</span> INTELIGÊNCIA RELACIONAL
                FEMININA
              </p>
              <h1 id="hero-title">
                Para amar
                <br />
                sem se perder
                <br />
                <em>de você.</em>
              </h1>
              <p className="hero-description">
                Você merece relações em que possa ser inteira. Um novo espaço
                para se compreender, cuidar dos seus vínculos e fazer escolhas
                com mais consciência.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#universo">
                  Conheça a AMAR.IA <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a className="text-link" href="#maria">
                  Quem é Maria? <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
              <p className="hero-note">
                <Heart size={15} aria-hidden="true" /> Feita para mulheres.
                Pensada para a sua história.
              </p>
            </div>
            <div className="hero-visual">
              <div className="visual-topline">
                <span>AMAR + IA</span>
                <span>UM NOVO COMEÇO</span>
              </div>
              <Image
                src="/brand/emblem.webp"
                alt="Símbolo da AMAR.IA: um M em fita rosa e roxa que lembra um coração, com uma estrela acima."
                width={700}
                height={700}
                sizes="(max-width: 700px) 90vw, 45vw"
                preload
                className="hero-emblem"
              />
              <div className="visual-caption">
                <span className="caption-line" />
                <p>
                  O amor começa
                  <br />
                  <em>na relação com você.</em>
                </p>
                <span className="caption-star" aria-hidden="true">
                  ✦
                </span>
              </div>
              <span className="coming-pill">
                <span /> Uma nova experiência. Em breve.
              </span>
            </div>
          </div>
          <div className="container hero-bottom">
            <span>
              CONTEÚDO <b>·</b> MARIA <b>·</b> COMUNIDADE
            </span>
            <a href="#universo" aria-label="Explorar o universo AMAR.IA">
              <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section
          className="section universe container"
          id="universo"
          aria-labelledby="universe-title"
        >
          <div className="section-intro">
            <div>
              <p className="eyebrow">SEU ESPAÇO DE RECONEXÃO</p>
              <h2 id="universe-title">
                Sua história é única.
                <br />
                <em>O seu caminho também.</em>
              </h2>
            </div>
            <p>
              A AMAR.IA nasce para reunir conhecimento, tecnologia e conexão
              humana. Três formas de acompanhar você nessa descoberta.
            </p>
          </div>
          <div className="pillar-grid">
            <article className="pillar-card pillar-content">
              <div className="card-top">
                <BookOpen size={26} strokeWidth={1.4} aria-hidden="true" />
                <span>01</span>
              </div>
              <h3>
                Palavras que
                <br />
                abrem caminhos.
              </h3>
              <p>
                Conteúdos sobre autoestima, vínculos e escolhas. Para ler no seu
                tempo e, futuramente, ouvir em áudios e podcasts.
              </p>
              <div className="card-bottom">
                <span>Conteúdo & podcasts</span>
                <span className="status-label">Em preparação</span>
              </div>
            </article>
            <article className="pillar-card pillar-maria">
              <div className="card-top">
                <Sparkles size={26} strokeWidth={1.4} aria-hidden="true" />
                <span>02</span>
              </div>
              <h3>
                Uma pausa.
                <br />
                Uma nova perspectiva.
              </h3>
              <p>
                Conheça a proposta da Conselheira Maria: uma IA pensada para
                apoiar reflexões sobre a sua vida relacional.
              </p>
              <div className="card-bottom">
                <a href="#maria">
                  Conselheira Maria{" "}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
                <span className="status-label">Em desenvolvimento</span>
              </div>
            </article>
            <article className="pillar-card pillar-community">
              <div className="card-top">
                <Users size={26} strokeWidth={1.4} aria-hidden="true" />
                <span>03</span>
              </div>
              <h3>
                Histórias diferentes.
                <br />
                Um lugar em comum.
              </h3>
              <p>
                Uma comunidade exclusiva para mulheres, com espaço para trocas
                respeitosas, aprendizados e conexão.
              </p>
              <div className="card-bottom">
                <span>Comunidade</span>
                <span className="status-label">Em breve</span>
              </div>
            </article>
          </div>
          <div className="topics">
            <span>CONVERSAS QUE IMPORTAM</span>
            {topics.map((topic) => (
              <span className="topic" key={topic}>
                {topic}
              </span>
            ))}
          </div>
        </section>

        <section
          className="maria-section section"
          id="maria"
          aria-labelledby="maria-title"
        >
          <div className="container maria-grid">
            <div className="maria-card">
              <div className="maria-card-top">
                <span className="maria-avatar">
                  <Sparkles size={27} aria-hidden="true" />
                </span>
                <div>
                  <strong>Maria</strong>
                  <span>CONSELHEIRA COM IA</span>
                </div>
                <span className="maria-badge">Em breve</span>
              </div>
              <div className="maria-card-body">
                <MessageCircle size={32} strokeWidth={1.2} aria-hidden="true" />
                <p>
                  Um espaço para olhar
                  <br />
                  com mais carinho
                  <br />
                  <em>para o que você sente.</em>
                </p>
                <span>Uma proposta de reflexão e autoconhecimento.</span>
              </div>
              <div className="maria-card-bottom">
                <ShieldCheck size={17} aria-hidden="true" />
                <span>IA com limites claros e curadoria humana.</span>
              </div>
            </div>
            <div className="maria-copy">
              <p className="eyebrow">TECNOLOGIA COM PROPÓSITO</p>
              <h2 id="maria-title">
                Conheça Maria.
                <br />
                <em>Um convite à reflexão.</em>
              </h2>
              <p>
                A Conselheira Maria está sendo desenvolvida para ajudar você a
                organizar pensamentos e explorar perguntas sobre suas relações,
                sem decidir por você.
              </p>
              <ul className="check-list">
                <li>
                  <Check aria-hidden="true" /> Reflexões sobre vínculos, limites
                  e escolhas.
                </li>
                <li>
                  <Check aria-hidden="true" /> Linguagem próxima, respeitosa e
                  sem julgamentos.
                </li>
                <li>
                  <Check aria-hidden="true" /> Diretrizes de segurança com
                  curadoria de psicólogas.
                </li>
              </ul>
              <div className="care-note">
                <ShieldCheck size={21} aria-hidden="true" />
                <p>
                  <strong>Acolhimento com responsabilidade.</strong> Maria será
                  uma inteligência artificial, não uma psicóloga. Não realizará
                  diagnósticos, psicoterapia ou aplicação de EMDR, nem
                  substituirá atendimento profissional.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section container curation"
          id="curadoria"
          aria-labelledby="curation-title"
        >
          <div className="section-intro">
            <div>
              <p className="eyebrow">CONHECIMENTO E CUIDADO</p>
              <h2 id="curation-title">
                Por trás da tecnologia,
                <br />
                <em>um olhar humano.</em>
              </h2>
            </div>
            <p>
              A curadoria técnico-científica da AMAR.IA contará com psicólogas
              experientes, especialistas em Terapia EMDR, na revisão de
              conteúdos, jornadas e diretrizes da Maria.
            </p>
          </div>
          <div className="curator-grid">
            <article className="curator">
              <span className="curator-initials" aria-hidden="true">
                LF
              </span>
              <div>
                <span className="curator-role">
                  CURADORIA TÉCNICO-CIENTÍFICA
                </span>
                <h3>Léa Fávero</h3>
                <p>Psicóloga e Psicoterapeuta EMDR</p>
              </div>
              <span className="curator-star" aria-hidden="true">
                ✦
              </span>
            </article>
            <article className="curator">
              <span className="curator-initials" aria-hidden="true">
                JC
              </span>
              <div>
                <span className="curator-role">
                  CURADORIA TÉCNICO-CIENTÍFICA
                </span>
                <h3>Juciane Carneiro</h3>
                <p>Psicóloga e especialista em Terapia EMDR</p>
              </div>
              <span className="curator-star" aria-hidden="true">
                ✦
              </span>
            </article>
          </div>
          <p className="curation-note">
            A curadoria orienta a construção da plataforma. Ela não representa
            atendimento individual nem acompanhamento de cada interação.
          </p>
        </section>

        <section
          className="launch-section"
          id="novidades"
          aria-labelledby="launch-title"
        >
          <div className="container launch-inner">
            <span className="launch-star" aria-hidden="true">
              ✦
            </span>
            <p className="eyebrow">ESTAMOS PREPARANDO ESSE ENCONTRO</p>
            <h2 id="launch-title">
              Um novo jeito de olhar
              <br />
              <em>para você e suas relações.</em>
            </h2>
            <p>
              A AMAR.IA está nascendo. Acompanhe os próximos passos
              <br className="desktop-break" /> e conheça esse universo desde o
              começo.
            </p>
            <a
              className="button button-primary"
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Acompanhe @amaria.club <Camera size={18} aria-hidden="true" />
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
            <div className="launch-meta">
              <span>
                <BookOpen size={15} aria-hidden="true" /> Para ler
              </span>
              <span>
                <Headphones size={15} aria-hidden="true" /> Para ouvir
              </span>
              <span>
                <Heart size={15} aria-hidden="true" /> Para se reconectar
              </span>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer container">
        <div className="footer-top">
          <Brand />
          <p>Para amar sem se perder de você.</p>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da AMAR.IA (abre em nova aba)"
          >
            <Camera size={21} />
          </a>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} AMAR.IA. Todos os direitos reservados.
          </p>
          <span>Plataforma em desenvolvimento · Fase 1</span>
        </div>
        <p className="footer-disclaimer">
          Conteúdo educativo e apoio à reflexão. A AMAR.IA não substitui
          psicoterapia, avaliação ou atendimento de saúde e não é um serviço de
          emergência.
        </p>
      </footer>
    </>
  );
}
