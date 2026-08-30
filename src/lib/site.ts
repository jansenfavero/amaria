export const site = {
  name: "AMAR.IA",
  title: "AMAR.IA — Para amar sem se perder de você",
  description:
    "Um novo espaço de inteligência relacional para mulheres. Conteúdo, Conselheira Maria com IA e comunidade, com curadoria de psicólogas.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://amar.ia.br",
  instagram: "https://www.instagram.com/amaria.club/",
} as const;

export const isIndexable =
  process.env.SITE_INDEXABLE === "true" && process.env.VERCEL_ENV !== "preview";
