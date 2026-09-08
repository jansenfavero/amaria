import assert from "node:assert/strict";
import { spawn } from "node:child_process";

// Run after `npm run build`. No credentials, database writes or external requests.
const port = process.env.SMOKE_PORT || "3011";
const origin = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    port,
  ],
  {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, AMARIA_DISABLE_REMOTE_FOR_SMOKE: "true" },
  },
);
let serverOutput = "";
const articleSlugs = [
  "relacionamento-toxico-7-sinais-de-que-voce-pode-estar-se-perdendo",
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
const articleImageSlugs = [
  "relacionamento-toxico-sinais-de-autoabandono-2026",
  ...articleSlugs.slice(1),
];

try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () =>
        reject(new Error("Production server did not start within 20 seconds.")),
      20000,
    );
    server.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    server.once("exit", (code) => {
      clearTimeout(timeout);
      reject(
        new Error(`Server exited before readiness: ${code}. ${serverOutput}`),
      );
    });
    server.stderr.on("data", (chunk) => {
      serverOutput += chunk.toString();
    });
    server.stdout.on("data", (chunk) => {
      serverOutput += chunk.toString();
      if (serverOutput.includes("Ready in")) {
        clearTimeout(timeout);
        resolve();
      }
    });
  });

  const publicPaths = [
    "/",
    "/conteudos",
    "/conteudos/buscando-um-relacionamento",
    "/buscar",
    "/cadastro",
    "/sobre",
    "/maria",
    "/podcasts",
    "/comunidade",
    "/curadoria",
    "/privacidade",
    "/api/health",
    "/robots.txt",
    "/ads.txt",
    "/manifest.webmanifest",
    "/sitemap.xml",
    "/icon.png",
    "/icon-512.png",
    "/apple-icon.png",
    "/brand/emblem.webp",
    "/brand/logo-horizontal.png",
    "/editorial/amor-proprio.webp",
    "/editorial/limites.webp",
    "/editorial/relacionamentos.webp",
    "/editorial/recomecos.webp",
    ...articleSlugs.map((slug) => `/conteudos/${slug}`),
    ...articleImageSlugs.map((slug) => `/articles/${slug}.webp`),
    "/pagina-inexistente",
  ];
  for (const path of publicPaths) {
    const response = await fetch(`${origin}${path}`, {
      signal: AbortSignal.timeout(10000),
    });
    assert.equal(
      response.status,
      path === "/pagina-inexistente" ? 404 : 200,
      path,
    );
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-frame-options"), "DENY");
    if (
      [
        "/",
        "/conteudos",
        "/conteudos/buscando-um-relacionamento",
        "/buscar",
        "/cadastro",
        "/sobre",
        "/maria",
        "/podcasts",
        "/comunidade",
        "/curadoria",
        "/privacidade",
      ].includes(path) ||
      articleSlugs.some((slug) => path === `/conteudos/${slug}`)
    ) {
      const html = await response.text();
      assert.match(html, /lang="pt-BR"/);
      assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
      if (path !== "/cadastro") assert.match(html, /O que é AMARIA\?/);
      assert.doesNotMatch(html, /AMAR\.IA/);
      assert.doesNotMatch(html, /https:\/\/amar\.ia\.br/);
      assert.match(html, /https:\/\/amaria\.me/);
      assert.match(
        html,
        /name="google-adsense-account" content="ca-pub-7411565684386334"/,
      );
      assert.match(
        html,
        /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-7411565684386334/,
      );
      if (path === "/") {
        assert.equal(
          (html.match(/class="post-card editorial-card /g) || []).length,
          11,
        );
        assert.equal((html.match(/aria-label="Curtir /g) || []).length, 11);
        assert.equal(
          (html.match(/aria-label="Compartilhar /g) || []).length,
          11,
        );
        assert.match(html, /20% abertas para conhecer/);
      }
      if (articleSlugs.some((slug) => path === `/conteudos/${slug}`)) {
        assert.match(html, /"@type":"Article"/);
        assert.match(html, /20%/);
        assert.match(html, /CONTINUE GRATUITAMENTE/);
        assert.match(html, /data-reading-access="preview"/);
        const visibleWords = Number(
          html.match(/data-visible-words="(\d+)"/)?.[1],
        );
        const totalWords = Number(html.match(/data-total-words="(\d+)"/)?.[1]);
        assert.ok(Number.isFinite(visibleWords) && visibleWords > 0);
        assert.ok(Number.isFinite(totalWords) && totalWords > visibleWords);
        assert.ok(
          visibleWords / totalWords <= 0.205,
          `Public preview exceeds 20% for ${path}`,
        );
        assert.doesNotMatch(html, /Curadoria Psicológica/i);
        assert.equal((html.match(/class="ad-slot/g) || []).length, 1);
        assert.doesNotMatch(html, /name="email"/);
      }
      if (path === "/conteudos") {
        assert.equal(
          (html.match(/class="post-card editorial-card grid-card"/g) || [])
            .length,
          11,
        );
        assert.equal(
          (html.match(/class="future-journey-card"/g) || []).length,
          5,
        );
      }
      if (path === "/conteudos/buscando-um-relacionamento") {
        assert.equal(
          (html.match(/class="post-card editorial-card grid-card"/g) || [])
            .length,
          10,
        );
      }
      const ids = new Set(
        [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
      );
      for (const match of html.matchAll(/href="#([^"]+)"/g))
        assert.ok(ids.has(match[1]), `Missing anchor: ${match[1]}`);
      if (
        process.env.SITE_INDEXABLE !== "true" ||
        process.env.VERCEL_ENV === "preview"
      )
        assert.match(html, /noindex/);
    } else if (path === "/api/health") {
      assert.deepEqual(await response.json(), {
        status: "ok",
        service: "amaria",
        phase: "2b-member-platform",
      });
      assert.equal(response.headers.get("cache-control"), "no-store");
    } else if (path === "/manifest.webmanifest") {
      const manifest = await response.json();
      assert.equal(manifest.lang, "pt-BR");
      assert.equal(manifest.start_url, "/");
      assert.deepEqual(manifest.icons.map((icon) => icon.sizes).sort(), [
        "192x192",
        "512x512",
      ]);
    } else if (
      path === "/robots.txt" &&
      (process.env.SITE_INDEXABLE !== "true" ||
        process.env.VERCEL_ENV === "preview")
    ) {
      assert.match(await response.text(), /Disallow: \/(?:\n|$)/);
    }
    console.log(`PASS ${response.status} ${path}`);
  }

  if (
    process.env.SITE_INDEXABLE === "true" &&
    process.env.VERCEL_ENV !== "preview"
  ) {
    const [robots, sitemap] = await Promise.all([
      fetch(`${origin}/robots.txt`).then((response) => response.text()),
      fetch(`${origin}/sitemap.xml`).then((response) => response.text()),
    ]);
    assert.match(robots, /Allow: \//);
    assert.match(robots, /Disallow: \/admin/);
    assert.match(robots, /Sitemap: https:\/\/amaria\.me\/sitemap\.xml/);
    for (const slug of articleSlugs)
      assert.match(
        sitemap,
        new RegExp(`<loc>https://amaria\\.me/conteudos/${slug}</loc>`),
      );
    console.log("PASS indexable robots and dynamic editorial sitemap");
  }
  for (const legacyHost of ["amar.ia.br"]) {
    const response = await fetch(`${origin}/conteudos?origem=legado`, {
      headers: { "x-forwarded-host": legacyHost },
      redirect: "manual",
    });
    assert.equal(response.status, 308);
    assert.equal(
      response.headers.get("location"),
      "https://amaria.me/conteudos?origem=legado",
    );
    console.log(`PASS canonical redirect ${legacyHost}`);
  }
  const adsText = await fetch(`${origin}/ads.txt`).then((response) =>
    response.text(),
  );
  assert.equal(
    adsText.trim(),
    "google.com, pub-7411565684386334, DIRECT, f08c47fec0942fa0",
  );
  console.log("PASS Google AdSense ads.txt");
  for (const [path, expected] of [
    ["/cadastro", /Criar meu perfil gratuito/],
    ["/entrar", /name="email"/],
    ["/recuperar-acesso", /Solicitar recuperação/],
    ["/auth/receber", /Confirmar meu acesso/],
    ["/auth/confirmado", /Continuar na AMARIA/],
    ["/auth/link-invalido", /Solicitar outro link/],
  ]) {
    const response = await fetch(`${origin}${path}`, {
      signal: AbortSignal.timeout(10000),
    });
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get("referrer-policy"), "no-referrer");
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
    const html = await response.text();
    assert.match(html, expected);
    assert.ok(html.includes("logo-horizontal.png"));
    assert.match(html, /noindex/);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
    if (path === "/entrar") {
      assert.match(html, /type="password"/);
      assert.match(html, /autocomplete="current-password"/i);
      assert.match(html, /Quero ser membro/);
      assert.match(html, /aria-label="Acesso à AMARIA"/);
      assert.match(html, /<a(?=[^>]*aria-current="page")[^>]*>Entrar<\/a>/);
    }
    if (path === "/cadastro") {
      assert.match(html, /autocomplete="new-password"/i);
      assert.match(html, /name="privacy"/);
      assert.match(
        html,
        /<a(?=[^>]*aria-current="page")[^>]*>Criar conta<\/a>/,
      );
    }
    console.log(`PASS auth page ${path}`);
  }
  for (const path of [
    "/admin",
    "/admin/conteudos",
    "/admin/conteudos/novo",
    "/admin/membros",
    "/admin/comentarios",
    "/meu-perfil",
    "/definir-senha",
  ]) {
    for (const cookie of ["", "sb-lhmrojqehenwviyytkmr-auth-token=malformed"]) {
      const response = await fetch(`${origin}${path}`, {
        redirect: "manual",
        headers: cookie ? { cookie } : {},
        signal: AbortSignal.timeout(10000),
      });
      assert.equal(response.status, 307, path);
      assert.equal(
        new URL(response.headers.get("location"), origin).pathname,
        "/entrar",
      );
      assert.match(response.headers.get("cache-control"), /no-store/);
      const body = await response.text();
      assert.doesNotMatch(
        body,
        /Sessão de|contato@jansenfavero\.com|Sua permissão de administrador está ativa/,
      );
    }
    console.log(`PASS protected ${path}: anonymous / malformed session denied`);
  }
  const legacyAccount = await fetch(`${origin}/minha-conta`, {
    redirect: "manual",
  });
  assert.equal(legacyAccount.status, 307);
  assert.equal(
    new URL(legacyAccount.headers.get("location"), origin).pathname,
    "/meu-perfil",
  );
  console.log("PASS legacy account route redirects to Meu Perfil");
  const callback = await fetch(
    `${origin}/auth/callback?next=https://example.com`,
    { redirect: "manual" },
  );
  assert.equal(callback.status, 307);
  assert.equal(
    callback.headers.get("location"),
    "https://amaria.me/auth/receber",
  );
  console.log("PASS callback rejects arbitrary redirect destination");
  const invalidConfirmation = await fetch(
    `${origin}/auth/confirm?token_hash=invalid&type=unsupported&next=https://example.com`,
    { redirect: "manual" },
  );
  assert.equal(invalidConfirmation.status, 307);
  assert.equal(
    invalidConfirmation.headers.get("location"),
    "https://amaria.me/auth/link-invalido",
  );
  console.log(
    "PASS confirmation route rejects invalid token type and open redirect",
  );
  console.log(
    "Production HTTP checks passed. Browser interaction and remote deployment are separate verification steps.",
  );
} finally {
  server.kill("SIGTERM");
}
