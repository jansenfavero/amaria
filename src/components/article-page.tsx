import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookHeart,
  CalendarDays,
  Clock3,
  Headphones,
  LockKeyhole,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  UserRoundPlus,
} from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { ArticleActions } from "@/components/article-actions";
import { ArticleComments } from "@/components/article-comments";
import { InlineArticleText } from "@/components/inline-article-text";
import { ReadingProgress } from "@/components/reading-progress";
import { getAdjacentArticles, getRelatedArticles } from "@/content/articles";
import type {
  Article,
  ArticleSection,
  ArticleSubsection,
} from "@/content/articles/types";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

type Preview = {
  introduction: string[];
  sections: ArticleSection[];
};

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function clipParagraph(value: string, remaining: number) {
  const words = value.replace(/\*\*/g, "").trim().split(/\s+/).filter(Boolean);
  if (words.length <= remaining) {
    return { value, used: words.length, complete: true };
  }
  return {
    value: `${words.slice(0, Math.max(remaining, 1)).join(" ")}…`,
    used: Math.max(remaining, 1),
    complete: false,
  };
}

function buildPublicPreview(article: Article): Preview {
  const paragraphs = [
    ...article.introduction,
    ...article.sections.flatMap((section) => [
      ...section.paragraphs,
      ...(section.subsections?.flatMap((item) => item.paragraphs) ?? []),
    ]),
  ];
  const limit = Math.max(
    1,
    Math.floor(paragraphs.reduce((total, item) => total + wordCount(item), 0) * 0.2),
  );
  let remaining = limit;
  const introduction: string[] = [];
  const sections: ArticleSection[] = [];

  for (const paragraph of article.introduction) {
    if (remaining <= 0) break;
    const clipped = clipParagraph(paragraph, remaining);
    introduction.push(clipped.value);
    remaining -= clipped.used;
    if (!clipped.complete) break;
  }

  for (const section of article.sections) {
    if (remaining <= 0) break;
    const sectionParagraphs: string[] = [];
    const subsections: ArticleSubsection[] = [];

    for (const paragraph of section.paragraphs) {
      if (remaining <= 0) break;
      const clipped = clipParagraph(paragraph, remaining);
      sectionParagraphs.push(clipped.value);
      remaining -= clipped.used;
      if (!clipped.complete) break;
    }

    for (const subsection of section.subsections ?? []) {
      if (remaining <= 0) break;
      const subsectionParagraphs: string[] = [];
      for (const paragraph of subsection.paragraphs) {
        if (remaining <= 0) break;
        const clipped = clipParagraph(paragraph, remaining);
        subsectionParagraphs.push(clipped.value);
        remaining -= clipped.used;
        if (!clipped.complete) break;
      }
      if (subsectionParagraphs.length) {
        subsections.push({
          heading: subsection.heading,
          paragraphs: subsectionParagraphs,
        });
      }
    }

    if (sectionParagraphs.length || subsections.length) {
      sections.push({
        heading: section.heading,
        paragraphs: sectionParagraphs,
        ...(subsections.length ? { subsections } : {}),
      });
    }
  }

  return { introduction, sections };
}

function ArticleText({
  introduction,
  sections,
  complete,
}: {
  introduction: readonly string[];
  sections: readonly ArticleSection[];
  complete: boolean;
}) {
  return (
    <>
      <div className="article-introduction">
        {introduction.map((paragraph, index) => (
          <p key={`${index}-${paragraph}`}>
            <InlineArticleText text={paragraph} />
          </p>
        ))}
      </div>

      <AdSlot placement="article-top" />

      <div className="article-body">
        {sections.map((section, index) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={`${paragraphIndex}-${paragraph}`}>
                <InlineArticleText text={paragraph} />
              </p>
            ))}
            {section.subsections?.map((subsection) => (
              <div className="article-subsection" key={subsection.heading}>
                <h3>{subsection.heading}</h3>
                {subsection.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={`${paragraphIndex}-${paragraph}`}>
                    <InlineArticleText text={paragraph} />
                  </p>
                ))}
              </div>
            ))}
            {complete && index === Math.floor(sections.length / 2) ? (
              <AdSlot placement="article-middle" />
            ) : null}
          </section>
        ))}
      </div>
    </>
  );
}

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

export async function ArticlePage({
  article,
  isMember,
  previewAlreadyLimited = false,
}: {
  article: Article;
  isMember: boolean;
  previewAlreadyLimited?: boolean;
}) {
  const related = getRelatedArticles(article);
  const adjacent = getAdjacentArticles(article);
  const preview = isMember
    ? null
    : previewAlreadyLimited
      ? {
          introduction: [...article.introduction],
          sections: [...article.sections],
        }
      : buildPublicPreview(article);

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

        <header className="article-hero">
          <Image
            className="article-hero-image"
            src={article.hero.src}
            alt={article.hero.alt}
            fill
            sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1300px) calc(100vw - 330px), 940px"
            preload
          />
          <div className="article-hero-copy">
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
                <Clock3 aria-hidden="true" /> {article.readingMinutes} min de leitura
              </span>
              <span>
                <CalendarDays aria-hidden="true" /> Publicado em{" "}
                {dateFormatter.format(new Date(article.publishedAt))}
              </span>
              <span>Por {article.author}</span>
            </div>
          </div>
        </header>

        <div className="article-layout">
          <div className="article-reading-column">
            {isMember && article.audioUrl ? (
              <section className="article-audio" aria-labelledby="article-audio-title">
                <Headphones aria-hidden="true" />
                <div>
                  <span>VERSÃO EM ÁUDIO</span>
                  <h2 id="article-audio-title">Prefere ouvir esta leitura?</h2>
                  <audio controls preload="metadata" src={article.audioUrl}>
                    Seu navegador não suporta reprodução de áudio.
                  </audio>
                </div>
              </section>
            ) : null}

            <ArticleText
              introduction={preview?.introduction ?? article.introduction}
              sections={preview?.sections ?? article.sections}
              complete={isMember}
            />

            {!isMember ? (
              <section className="article-access-gate" aria-labelledby="access-gate-title">
                <div className="access-progress">
                  <strong>20%</strong>
                  <span>da leitura</span>
                </div>
                <div>
                  <span className="eyebrow">
                    <LockKeyhole aria-hidden="true" /> CONTINUE GRATUITAMENTE
                  </span>
                  <h2 id="access-gate-title">Esta reflexão continua com você.</h2>
                  <p>
                    Crie seu perfil gratuito para acessar este artigo completo,
                    comentar e fazer parte das próximas experiências da AMARIA.
                  </p>
                  <div className="access-gate-actions">
                    <Link
                      href={`/cadastro?next=/conteudos/${article.slug}`}
                      className="button button-primary"
                    >
                      Quero continuar a leitura <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                    <Link
                      href={`/entrar?next=/conteudos/${article.slug}`}
                      className="button button-secondary"
                    >
                      Já sou membro
                    </Link>
                  </div>
                  <small>Cadastro gratuito · privacidade por princípio</small>
                </div>
              </section>
            ) : (
              <>
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
                      Inteligência relacional para organizar perguntas com mais
                      clareza. Não substitui terapia.
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
                      Conteúdo informativo e educativo; não substitui
                      acompanhamento profissional e não realiza diagnóstico,
                      psicoterapia ou EMDR.
                    </p>
                    <Link href="/curadoria">
                      Conheça os princípios da curadoria{" "}
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </section>
                <AdSlot placement="article-end" />
              </>
            )}

            <div className="article-social-block">
              <div>
                <span>GUARDE OU COMPARTILHE</span>
                <h2>Se fez sentido, leve esta reflexão com você.</h2>
              </div>
              <ArticleActions
                slug={article.slug}
                title={article.title}
                isMember={isMember}
              />
            </div>

            <ArticleComments articleSlug={article.slug} isMember={isMember} />

            {!isMember ? (
              <section className="article-signup-cta">
                <UserRoundPlus aria-hidden="true" />
                <div>
                  <span>SEU ESPAÇO NA AMARIA</span>
                  <h2>Entre para o começo.</h2>
                  <p>
                    As 100 primeiras membros terão benefícios e acessos
                    exclusivos na plataforma.
                  </p>
                </div>
                <Link href="/cadastro" className="button button-primary">
                  Ser membro fundadora <ArrowRight size={16} />
                </Link>
              </section>
            ) : null}
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
