import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Inspect actual production HTML without starting a server or using the network.
const routes = [
  "index",
  "sobre",
  "maria",
  "podcasts",
  "comunidade",
  "curadoria",
  "privacidade",
];
for (const route of routes) {
  const html = await readFile(`.next/server/app/${route}.html`, "utf8");
  assert.match(html, /lang="pt-BR"/);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, route);
  assert.doesNotMatch(html, /<(input|textarea|form)(?:\s|>)/i);
  assert.match(html, /O que é amar\.ia\?/);
  assert.match(html, /id="conteudo-principal"/);
  for (const href of [
    "/sobre",
    "/maria",
    "/podcasts",
    "/comunidade",
    "/curadoria",
    "/privacidade",
  ])
    assert.ok(html.includes(`href="${href}"`), `${route}: missing ${href}`);
  if (
    process.env.SITE_INDEXABLE !== "true" ||
    process.env.VERCEL_ENV === "preview"
  )
    assert.match(html, /noindex/);
  if (route === "index") {
    assert.equal((html.match(/class="post-card"/g) || []).length, 4);
    for (const action of ["Curtir:", "Comentar:", "Compartilhar:"])
      assert.equal(
        (html.match(new RegExp(`aria-label="${action}`, "g")) || []).length,
        4,
      );
    assert.match(html, /Prévias editoriais/);
    const ids = new Set(
      [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
    );
    for (const match of html.matchAll(/href="\/?#([^"]+)"/g))
      assert.ok(ids.has(match[1]), `Missing anchor: ${match[1]}`);
  }
  console.log(`PASS production HTML /${route === "index" ? "" : route}`);
}
console.log(
  "Static production checks passed. This does not replace browser interaction or remote deployment checks.",
);
