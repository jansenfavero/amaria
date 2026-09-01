import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Inspect actual production HTML without starting a server or using the network.
const routes = [
  "index",
  "conteudos",
  "conteudos/buscando-um-relacionamento",
  "cadastro",
  "sobre",
  "maria",
  "podcasts",
  "comunidade",
  "curadoria",
  "privacidade",
];
const articleSlugs = [
  "antes-de-namorar-defina-o-que-voce-procura",
  "quem-quer-algo-serio-demonstra-intencao",
  "nao-confunda-quimica-com-compatibilidade",
  "disponibilidade-emocional-importa",
  "interesse-de-verdade-se-sustenta-em-atitudes",
  "nao-diminua-seus-padroes-para-nao-ficar-sozinha",
  "relacionamento-serio-comeca-com-clareza",
  "reciprocidade-vale-mais-do-que-potencial",
  "paz-tambem-e-criterio",
  "escolha-alguem-que-queira-construir-com-voce",
];
for (const route of routes) {
  const html = await readFile(`.next/server/app/${route}.html`, "utf8");
  assert.match(html, /lang="pt-BR"/);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, route);
  assert.doesNotMatch(html, /<(input|textarea)(?:\s|>)/i);
  assert.match(html, /O que é amar\.ia\?/);
  assert.ok(html.includes("logo-horizontal.png"));
  assert.match(html, /id="conteudo-principal"/);
  const topbar = html.match(
    /<header class="app-topbar">([\s\S]*?)<\/header>/,
  )?.[1];
  assert.ok(topbar, `${route}: missing app header`);
  assert.ok(topbar.includes("logo-horizontal.png"));
  assert.ok(
    topbar.indexOf('class="mobile-brand"') <
      topbar.indexOf('class="icon-button mobile-menu-toggle"'),
    `${route}: logo must precede the right-hand menu`,
  );
  assert.match(
    topbar,
    /aria-label="Abrir menu"[^>]*aria-controls="amaria-navigation"/,
  );
  assert.match(
    html,
    /<main[^>]*class="app-main"><div class="mobile-page-status">/,
  );
  assert.match(html, /<dialog[^>]*id="amaria-navigation"/);
  for (const href of [
    "/sobre",
    "/conteudos",
    "/buscar",
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
    assert.equal(
      (html.match(/class="post-card editorial-card /g) || []).length,
      10,
    );
    for (const name of articleSlugs)
      assert.ok(
        html.includes(`/articles/${name}.webp`),
        `Missing editorial image: ${name}`,
      );
    assert.equal((html.match(/aria-label="Curtir /g) || []).length, 10);
    assert.equal((html.match(/aria-label="Compartilhar /g) || []).length, 10);
    assert.match(html, /Dez leituras públicas/);
    const ids = new Set(
      [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
    );
    for (const match of html.matchAll(/href="\/?#([^"]+)"/g))
      assert.ok(ids.has(match[1]), `Missing anchor: ${match[1]}`);
  }
  console.log(`PASS production HTML /${route === "index" ? "" : route}`);
}

for (const slug of articleSlugs) {
  const html = await readFile(
    `.next/server/app/conteudos/${slug}.html`,
    "utf8",
  );
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, slug);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /Curadoria Psicológica/i);
  assert.equal((html.match(/class="ad-slot/g) || []).length, 3);
  assert.ok(html.includes(`/articles/${slug}.webp`));
  assert.doesNotMatch(html, /name="email"/);
  console.log(`PASS production article /conteudos/${slug}`);
}
console.log(
  "Static production checks passed. This does not replace browser interaction or remote deployment checks.",
);
