import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import postcss from "postcss";
import sharp from "sharp";

// Static design contracts, not browser layout or a full accessibility audit.
const css = postcss.parse(
  `${await readFile("src/app/globals.css", "utf8")}\n${await readFile("src/app/editorial.css", "utf8")}`,
);
function value(selector, property, width = 390) {
  let result;
  css.walkRules((rule) => {
    if (!rule.selectors.includes(selector)) return;
    for (let parent = rule.parent; parent; parent = parent.parent) {
      if (parent.type !== "atrule" || parent.name !== "media") continue;
      const max = parent.params.match(/max-width:\s*(\d+)px/);
      const min = parent.params.match(/min-width:\s*(\d+)px/);
      if ((max && width > Number(max[1])) || (min && width < Number(min[1])))
        return;
      if (parent.params.includes("prefers-reduced-motion")) return;
    }
    rule.walkDecls(property, (declaration) => {
      result = declaration.value;
    });
  });
  assert.ok(result, `Missing ${selector}: ${property}`);
  return result.replace(/var\((--[\w-]+)\)/g, (_, name) =>
    value(":root", name, width),
  );
}
function pixels(size) {
  assert.match(size, /^[\d.]+(rem|px)$/);
  return parseFloat(size) * (size.endsWith("rem") ? 16 : 1);
}
for (const width of [320, 360, 390, 430, 760]) {
  for (const selector of [
    ".post-excerpt",
    ".dialog-inner > p",
    ".info-description",
    ".info-text p",
    ".info-tile p",
    ".info-callout p",
    ".safety-note p",
  ])
    assert.ok(
      pixels(value(selector, "font-size", width)) >= 16,
      `${selector} below 16px at ${width}px`,
    );
  assert.ok(pixels(value(".article-actions button", "font-size", width)) >= 12);
  assert.ok(
    pixels(value(".article-actions button", "min-height", width)) >= 44,
  );
  assert.ok(pixels(value(".article-introduction p", "font-size", width)) >= 17);
  assert.ok(
    pixels(value(".mobile-drawer .nav-item", "font-size", width)) >= 16,
  );
  assert.equal(value(".topbar-end", "display", width), "none");
  assert.equal(value(".mobile-page-status", "display", width), "flex");
  assert.equal(value(".mobile-menu-toggle", "display", width), "inline-flex");
  assert.equal(value(".mobile-menu-toggle", "margin-left", width), "auto");
  assert.ok(pixels(value(".mobile-menu-toggle", "width", width)) >= 48);
  assert.ok(pixels(value(".mobile-menu-toggle", "height", width)) >= 48);
  assert.ok(pixels(value(".mobile-brand .brand-logo", "width", width)) >= 170);
  assert.ok(
    pixels(value(".mobile-page-status .preview-badge", "font-size", width)) >=
      12,
  );
  console.log(`PASS mobile type / controls at ${width}px (static CSS)`);
}
const logoPath = "public/brand/logo-horizontal.png";
const [logoMetadata, logoFile, logoPixels] = await Promise.all([
  sharp(logoPath).metadata(),
  stat(logoPath),
  sharp(logoPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
]);
assert.equal(logoMetadata.format, "png");
assert.equal(logoMetadata.width, 636);
assert.equal(logoMetadata.height, 207);
assert.equal(logoMetadata.hasAlpha, true);
const { data: logoData, info: logoInfo } = logoPixels;
for (const [x, y] of [
  [0, 0],
  [logoInfo.width - 1, 0],
  [0, logoInfo.height - 1],
  [logoInfo.width - 1, logoInfo.height - 1],
]) {
  const alpha = logoData[(y * logoInfo.width + x) * logoInfo.channels + 3];
  assert.equal(alpha, 0, `Logo background is opaque at ${x},${y}`);
}
assert.ok(logoFile.size < 200000);
console.log(
  `PASS transparent official logo: ${logoMetadata.width}×${logoMetadata.height}`,
);
for (const width of [761, 1024, 1440]) {
  assert.equal(value(".topbar-end", "display", width), "flex");
  for (const selector of [
    ".mobile-menu-toggle",
    ".mobile-page-status",
    ".mobile-brand",
  ])
    assert.equal(value(selector, "display", width), "none");
}
assert.equal(value(".mobile-drawer", "margin"), "0 0 0 auto");
console.log("PASS responsive header / right-hand drawer (static CSS)");
assert.equal(value("html", "scrollbar-width", 1440), "thin");
assert.ok(pixels(value("*::-webkit-scrollbar", "width", 1440)) <= 8);
assert.equal(value(".topic-grid", "scrollbar-width", 390), "none");
console.log("PASS subtle desktop scrollbar / hidden mobile topic scrollbar");
function rgb(color) {
  if (color === "white") return [255, 255, 255];
  assert.match(color, /^#[\da-f]{6}$/i);
  return color
    .slice(1)
    .match(/../g)
    .map((part) => parseInt(part, 16));
}
function luminance(channels) {
  return channels
    .map((channel) => {
      const c = channel / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, c, index) => sum + c * [0.2126, 0.7152, 0.0722][index], 0);
}
function ratio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
const checks = [
  [
    "mobile launch badge",
    value(".mobile-page-status .preview-badge", "color"),
    value(".mobile-page-status .preview-badge", "background"),
  ],
  ["post text", value(".post-excerpt", "color"), value(":root", "--surface")],
  ["post kicker", value(".post-kicker", "color"), value(":root", "--surface")],
  [
    "primary button",
    value(".button-primary", "color"),
    value(".button-primary", "background"),
  ],
  [
    "active menu",
    value(".nav-item.active", "color"),
    value(".nav-item.active", "background"),
  ],
  ...["rose", "sage", "lilac", "sand"].map((tone) => [
    `topic ${tone}`,
    value(`.tone-${tone}`, "color"),
    value(`.tone-${tone}`, "background"),
  ]),
];
for (const [label, foreground, background] of checks) {
  const contrast = ratio(rgb(foreground), rgb(background));
  assert.ok(contrast >= 4.5, `${label}: ${contrast.toFixed(2)}:1`);
  console.log(`PASS ${label} contrast ${contrast.toFixed(2)}:1`);
}
const stops = value("body", "background-image")
  .match(/#[\da-f]{6}/gi)
  .map(rgb);
for (const selector of [
  "body",
  ".feed-disclosure",
  ".section-heading h2",
  ".feed-welcome > div > p:last-child",
]) {
  let minimum = Infinity;
  for (let stop = 0; stop < stops.length - 1; stop++) {
    for (let step = 0; step <= 100; step++) {
      const background = stops[stop].map(
        (c, index) => c + ((stops[stop + 1][index] - c) * step) / 100,
      );
      minimum = Math.min(
        minimum,
        ratio(rgb(value(selector, "color")), background),
      );
    }
  }
  assert.ok(minimum >= 4.5, `${selector} on gradient: ${minimum.toFixed(2)}:1`);
  console.log(
    `PASS ${selector} on gradient, minimum sampled ${minimum.toFixed(2)}:1`,
  );
}
for (const name of [
  "amor-proprio",
  "limites",
  "relacionamentos",
  "recomecos",
]) {
  const path = `public/editorial/${name}.webp`;
  const [metadata, file] = await Promise.all([
    sharp(path).metadata(),
    stat(path),
  ]);
  assert.equal(metadata.format, "webp");
  assert.ok(metadata.width >= 1000 && metadata.height >= 650);
  assert.ok(file.size < 300000, `${path} must remain below 300 KB`);
  console.log(
    `PASS ${path}: ${metadata.width}×${metadata.height}, ${Math.round(file.size / 1024)} KiB`,
  );
}
for (const name of [
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
]) {
  const path = `public/articles/${name}.webp`;
  const [metadata, file] = await Promise.all([
    sharp(path).metadata(),
    stat(path),
  ]);
  assert.equal(metadata.format, "webp");
  assert.equal(metadata.width, 1600);
  assert.equal(metadata.height, 900);
  assert.ok(file.size < 300000, `${path} must remain below 300 KB`);
  console.log(
    `PASS ${path}: ${metadata.width}×${metadata.height}, ${Math.round(file.size / 1024)} KiB`,
  );
}
