import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ArticlePage } from "@/components/article-page";
import { articles, getArticle, plainArticleText } from "@/content/articles";
import { isIndexable, site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: { absolute: article.seoTitle },
    description: article.seoDescription,
    keywords: [...article.keywords],
    authors: [{ name: article.author, url: site.url }],
    alternates: { canonical: article.href },
    robots: { index: isIndexable, follow: isIndexable },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      siteName: site.name,
      url: article.href,
      title: article.title,
      description: article.seoDescription,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [site.name],
      section: article.category,
      tags: [...article.keywords],
      images: [
        {
          url: article.hero.src,
          width: 1600,
          height: 900,
          alt: article.hero.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.seoDescription,
      images: [article.hero.src],
    },
  };
}

export default async function ArticleRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const articleBody = [
    ...article.introduction,
    ...article.sections.flatMap((section) => [
      ...section.paragraphs,
      ...(section.subsections?.flatMap((item) => item.paragraphs) ?? []),
    ]),
  ]
    .map(plainArticleText)
    .join("\n\n");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription,
    image: [`${site.url}${article.hero.src}`],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: "pt-BR",
    mainEntityOfPage: `${site.url}${article.href}`,
    articleSection: article.category,
    keywords: article.keywords.join(", "),
    wordCount: article.wordCount,
    articleBody,
    author: { "@type": "Organization", name: article.author, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/brand/logo-horizontal.png`,
      },
    },
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Conteúdos",
        item: `${site.url}/conteudos`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.category,
        item: `${site.url}/conteudos/${article.categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: `${site.url}${article.href}`,
      },
    ],
  };

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ArticlePage article={article} />
    </AppShell>
  );
}
