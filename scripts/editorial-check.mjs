import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

async function readCollection(path) {
  const source = (await readFile(path, "utf8"))
    .replace(/^export const \w+ = /, "")
    .replace(/\s+as const;\s*$/, "");
  return Function(`"use strict"; return (${source})`)();
}

const articles = [
  ...(await readCollection(
    "src/content/articles/self-loss-collection-one.ts",
  )),
  ...(await readCollection(
    "src/content/articles/relationship-collection-one.ts",
  )),
  ...(await readCollection(
    "src/content/articles/relationship-collection-two.ts",
  )),
];
const slugs = new Set(articles.map((article) => article.slug));

assert.equal(articles.length, 11, "The editorial collection must have 11 articles");
assert.equal(slugs.size, articles.length, "Article slugs must be unique");

for (const article of articles) {
  const richText = [
    article.title,
    article.subtitle,
    ...article.introduction,
    ...article.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.subsections?.flatMap((subsection) => [
        subsection.heading,
        ...subsection.paragraphs,
      ]) ?? []),
    ]),
    ...article.reflection.questions,
  ].join(" ");
  const plainText = richText.replace(/\[\[([^|]+)\|([^\]]+)\]\]/g, "$1");
  const words = plainText.trim().split(/\s+/).length;

  assert.ok(words >= 1400 && words <= 2200, `${article.slug}: ${words} words`);
  assert.ok(
    article.sections.length >= 6,
    `${article.slug}: too few H2 sections`,
  );
  assert.equal(article.reflection.questions.length, 4);
  assert.ok(
    article.seoTitle.length <= 70,
    `${article.slug}: SEO title too long`,
  );
  assert.ok(
    article.seoDescription.length >= 120 &&
      article.seoDescription.length <= 165,
    `${article.slug}: SEO description length ${article.seoDescription.length}`,
  );
  assert.equal(article.relatedSlugs.length, 3);
  for (const related of article.relatedSlugs)
    assert.ok(
      slugs.has(related),
      `${article.slug}: missing related ${related}`,
    );

  for (const match of richText.matchAll(
    /\[\[[^|]+\|\/conteudos\/([^\]]+)\]\]/g,
  ))
    assert.ok(
      slugs.has(match[1]),
      `${article.slug}: broken internal link ${match[1]}`,
    );

  const image = await stat(`public${article.hero.src}`);
  assert.ok(image.size > 10000 && image.size < 300000);
  console.log(`PASS ${words} words · ${article.slug}`);
}

console.log("Editorial collection checks passed.");
