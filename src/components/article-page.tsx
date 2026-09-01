import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookHeart,
  CalendarDays,
  Clock3,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  UserRoundPlus,
} from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { ArticleActions } from "@/components/article-actions";
import { InlineArticleText } from "@/components/inline-article-text";
import { ReadingProgress } from "@/components/reading-progress";
import { getAdjacentArticles, getRelatedArticles } from "@/content/articles";
import type { Article } from "@/content/articles/types";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function MiniArticleCard({ article }: { article: Article }) {
  return (
    <article className="related-card">
      <Link href={article.href} className="related-image">
        <Image
          src={article.hero.src}
          alt=""
          fill
          sizes="(max-width: 760px) calc(100vw - 80px), 300px"
        />
      </Link>
      <div>
        <span>{article.readingMinutes} min de leitura</span>
        <h3>
          <Link href={article.href}>{article.title}</Link>
        </h3>
        <Link href={article.href} className="related-link">
          Ler artigo <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function ArticlePage({ article }: { article: Article }) {
  const related = getRelatedArticles(article);
  const adjacent = getAdjacentArticles(article);

  return (
    <>
      <ReadingProgress />
      <article className="article-page" data-article>
        <nav className="article-breadcrumbs" aria-label="Caminho da página">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href="/conteudos">Conteúdos</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/conteudos/${article.categorySlug}`}>
            {article.category}
          </Link>
        </nav>

        <header className="article-hero-copy">
          <Link
            className="article-category"
            href={`/conteudos/${article.categorySlug}`}
          >
            {article.category}
          </Link>
          <h1>{article.title}</h1>
          <p className="article-subtitle">{article.subtitle}</p>
          <div className="article-meta">
            <span>
              <Clock3 aria-hidden="true" /> {article.readingMinutes} min de
              leitura
            </span>
            <span>
              <CalendarDays aria-hidden="true" /> Publicado em{" "}
              {dateFormatter.format(new Date(article.publishedAt))}
            </span>
            <span>Por {article.author}</span>
          </div>
        </header>

        <figure className="article-hero-image">
          <Image
            src={article.hero.src}
            alt={article.hero.alt}
            fill
            sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1300px) calc(100vw - 330px), 940px"
            preload
          />
        </figure>

        <div className="article-layout">
          <div className="article-reading-column">
            <div className="article-introduction">
              {article.introduction.map((paragraph) => (
                <p key={paragraph}>
                  <InlineArticleText text={paragraph} />
                </p>
              ))}
            </div>

            <AdSlot placement="article-top" />

            <div className="article-body">
              {article.sections.map((section, index) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>
                      <InlineArticleText text={paragraph} />
                    </p>
                  ))}
                  {section.subsections?.map((subsection) => (
                    <div
                      className="article-subsection"
                      key={subsection.heading}
                    >
                      <h3>{subsection.heading}</h3>
                      {subsection.paragraphs.map((paragraph) => (
                        <p key={paragraph}>
                          <InlineArticleText text={paragraph} />
                        </p>
                      ))}
                    </div>
                  ))}
                  {index === Math.floor(article.sections.length / 2) ? (
                    <AdSlot placement="article-middle" />
                  ) : null}
                </section>
              ))}
            </div>

            <aside className="article-reflection">
              <Sparkles aria-hidden="true" />
              <div>
                <span>UMA PAUSA PARA VOCÊ</span>
                <h2>{article.reflection.title}</h2>
                <ul>
                  {article.reflection.questions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </div>
            </aside>

            <section className="article-maria-cta">
              <div className="maria-cta-symbol">
                <Image src="/brand/emblem.webp" alt="" width={88} height={88} />
              </div>
              <div>
                <span>CONSELHEIRA MARIA · EM BREVE</span>
                <h2>Leve sua reflexão para uma conversa com Maria.</h2>
                <p>
                  Um espaço de inteligência relacional para organizar perguntas
                  com mais clareza. Não substitui terapia.
                </p>
                <Link href="/maria" className="button button-primary">
                  Conheça a Maria <MessageCircleHeart size={17} />
                </Link>
              </div>
            </section>

            <section className="article-curation">
              <BookHeart aria-hidden="true" />
              <div>
                <span>CURADORIA PSICOLÓGICA</span>
                <h2>Cuidado editorial em cada conversa</h2>
                <p>
                  Curadoria da plataforma por {article.curators.join(" e ")}.
                  Este conteúdo tem caráter informativo e educativo e não
                  substitui acompanhamento psicológico ou atendimento
                  profissional em saúde mental. A plataforma não realiza
                  diagnóstico, psicoterapia ou EMDR.
                </p>
                <Link href="/curadoria">
                  Conheça os princípios da curadoria{" "}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </section>

            <AdSlot placement="article-end" />

            <div className="article-social-block">
              <div>
                <span>GUARDE OU COMPARTILHE</span>
                <h2>Se fez sentido, leve esta reflexão com você.</h2>
              </div>
              <ArticleActions slug={article.slug} title={article.title} />
            </div>

            <section className="article-signup-cta">
              <UserRoundPlus aria-hidden="true" />
              <div>
                <span>SEU ESPAÇO NA AMAR.IA</span>
                <h2>Crie sua conta gratuita.</h2>
                <p>
                  Receba o aviso de abertura e seja uma das primeiras a guardar
                  conteúdos e continuar suas reflexões.
                </p>
              </div>
              <Link href="/cadastro" className="button button-primary">
                Quero participar <ArrowRight size={16} />
              </Link>
            </section>
          </div>

          <aside className="article-side-note">
            <ShieldCheck aria-hidden="true" />
            <strong>Leitura com cuidado</strong>
            <p>
              Observe padrões, contexto e a sua experiência. Relações humanas
              não cabem em regras absolutas.
            </p>
          </aside>
        </div>

        <section className="related-section" aria-labelledby="related-title">
          <span className="eyebrow">CONTINUE A REFLEXÃO</span>
          <h2 id="related-title">Conteúdos relacionados</h2>
          <div className="related-grid">
            {related.map((item) => (
              <MiniArticleCard article={item} key={item.slug} />
            ))}
          </div>
        </section>

        <nav className="article-pagination" aria-label="Artigos da coleção">
          {adjacent.previous ? (
            <Link href={adjacent.previous.href}>
              <ArrowLeft aria-hidden="true" />
              <span>
                <small>ARTIGO ANTERIOR</small>
                {adjacent.previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {adjacent.next ? (
            <Link href={adjacent.next.href}>
              <span>
                <small>PRÓXIMO ARTIGO</small>
                {adjacent.next.title}
              </span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <Link href="/conteudos">
              <span>
                <small>CONTINUE EXPLORANDO</small>
                Ver todos os conteúdos
              </span>
              <ArrowRight aria-hidden="true" />
            </Link>
          )}
        </nav>
      </article>
    </>
  );
}
