import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import postcss from "postcss";

const source = await readFile("src/lib/auth/policy.ts", "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
});
const policy = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
let cases = 0;
for (const role of [
  "admin",
  "curator",
  "member",
  "ADMIN",
  "owner",
  null,
  undefined,
  { role: "admin" },
]) {
  for (const active of [true, false, "true", 1, null, undefined]) {
    assert.equal(
      policy.canAccessAdmin(role, active),
      role === "admin" && active === true,
    );
    cases++;
  }
}
assert.equal(policy.isAccountRole("admin"), true);
assert.equal(policy.isAccountRole("curator"), true);
assert.equal(policy.isAccountRole("member"), true);
assert.equal(policy.isAccountRole({ role: "admin" }), false);
assert.equal(policy.validEmail("pessoa@example.com"), true);
for (const value of [
  "",
  "invalido",
  "pessoa@",
  "@example.com",
  "nome sobrenome@example.com",
  `${"x".repeat(250)}@example.com`,
]) {
  assert.equal(policy.validEmail(value), false);
}
assert.equal(policy.validNewPassword("x".repeat(11)), false);
assert.equal(policy.validNewPassword("x".repeat(12)), true);
assert.equal(policy.validNewPassword("x".repeat(72)), true);
assert.equal(policy.validNewPassword("x".repeat(73)), false);
assert.equal(policy.validNewPassword("é".repeat(36)), true);
assert.equal(policy.validNewPassword("é".repeat(37)), false);
assert.equal(policy.validNewPassword("💜".repeat(18)), true);
assert.equal(policy.validNewPassword("💜".repeat(19)), false);
console.log(
  `PASS ${cases} role/status combinations; email and password boundaries`,
);

const css = postcss.parse(await readFile("src/app/auth.css", "utf8"));
function value(selector, property, width) {
  let result;
  css.walkRules((rule) => {
    if (!rule.selectors.includes(selector)) return;
    for (let parent = rule.parent; parent; parent = parent.parent) {
      if (parent.type !== "atrule" || parent.name !== "media") continue;
      const max = parent.params.match(/max-width:\s*(\d+)px/);
      if (max && width > Number(max[1])) return;
    }
    rule.walkDecls(property, (declaration) => {
      result = declaration.value;
    });
  });
  return result;
}
for (const width of [320, 360, 390, 430, 760]) {
  for (const selector of [
    ".auth-description",
    ".auth-field input",
    ".auth-hint",
    ".auth-form-note",
    ".auth-checkbox",
    ".auth-message",
    ".button.auth-submit",
  ]) {
    assert.equal(value(selector, "font-size", width), "1rem");
  }
  assert.equal(value(".auth-field input", "min-height", width), "54px");
  assert.equal(value(".button.auth-submit", "min-height", width), "54px");
  assert.equal(value(".auth-story", "display", width), "none");
  const logoWidth = value(".auth-header .brand-logo", "width", width);
  assert.ok(parseFloat(logoWidth) >= 178);
}
console.log("PASS auth mobile type, controls and official logo contracts");
