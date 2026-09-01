const canonicalProductionUrl = "https://amaria.me";

const configuredSiteUrl =
  process.env.VERCEL_ENV === "production"
    ? canonicalProductionUrl
    : process.env.NEXT_PUBLIC_SITE_URL || canonicalProductionUrl;

export const site = {
  name: "AMARIA",
  title: "AMARIA — Para amar sem se perder de você",
  description:
    "Um novo espaço de inteligência relacional para mulheres. Conteúdo, Conselheira Maria com IA e comunidade, com curadoria de psicólogas.",
  url: configuredSiteUrl.replace(/\/$/, ""),
  instagram: "https://www.instagram.com/amaria.club/",
} as const;

export const isIndexable =
  process.env.VERCEL_ENV === "production" ||
  (process.env.SITE_INDEXABLE === "true" &&
    process.env.VERCEL_ENV !== "preview");
