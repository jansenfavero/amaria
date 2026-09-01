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
  { stdio: ["ignore", "pipe", "pipe"] },
);
let serverOutput = "";

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

  for (const path of [
    "/",
    "/sobre",
    "/maria",
    "/podcasts",
    "/comunidade",
    "/curadoria",
    "/privacidade",
    "/api/health",
    "/robots.txt",
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
    "/pagina-inexistente",
  ]) {
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
        "/sobre",
        "/maria",
        "/podcasts",
        "/comunidade",
        "/curadoria",
        "/privacidade",
      ].includes(path)
    ) {
      const html = await response.text();
      assert.match(html, /lang="pt-BR"/);
      assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
      assert.doesNotMatch(html, /<(input|textarea|form)(?:\s|>)/i);
      assert.match(html, /O que é amar\.ia\?/);
      if (path === "/") {
        assert.equal((html.match(/class="post-card"/g) || []).length, 4);
        for (const action of ["Curtir:", "Comentar:", "Compartilhar:"])
          assert.equal(
            (html.match(new RegExp(`aria-label="${action}`, "g")) || []).length,
            4,
          );
        assert.match(html, /Prévias editoriais/);
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
        phase: "2a-access-base",
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
  for (const [path, expected] of [
    ["/entrar", /name="email"/],
    ["/recuperar-acesso", /Solicitar recuperação/],
    ["/auth/receber", /Confirmar meu acesso/],
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
      assert.match(html, /Ainda não há cadastro público/);
    }
    console.log(`PASS auth page ${path}`);
  }
  for (const path of ["/admin", "/minha-conta", "/definir-senha"]) {
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
  const callback = await fetch(
    `${origin}/auth/callback?next=https://example.com`,
    { redirect: "manual" },
  );
  assert.equal(callback.status, 307);
  assert.equal(
    callback.headers.get("location"),
    "https://amar.ia.br/auth/receber",
  );
  console.log("PASS callback rejects arbitrary redirect destination");
  console.log(
    "Production HTTP checks passed. Browser interaction and remote deployment are separate verification steps.",
  );
} finally {
  server.kill("SIGTERM");
}
