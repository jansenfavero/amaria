import type {
  ArticleSection,
  ArticleSubsection,
} from "@/content/articles/types";

export type EditorialContent = {
  schema_version: 1;
  introduction: string[];
  sections: ArticleSection[];
  reflection: {
    title: string;
    questions: string[];
  };
};

function paragraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((item) => item.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

export function parseEditorialBody(
  source: string,
  reflectionTitle: string,
  reflectionQuestions: string,
): EditorialContent {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const introduction: string[] = [];
  const sections: {
    heading: string;
    paragraphs: string[];
    subsections: { heading: string; paragraphs: string[] }[];
  }[] = [];
  let currentSection: (typeof sections)[number] | null = null;
  let currentSubsection:
    | { heading: string; paragraphs: string[] }
    | null = null;
  let buffer: string[] = [];

  function flush() {
    const items = paragraphs(buffer.join("\n"));
    buffer = [];
    if (!items.length) return;
    if (currentSubsection) currentSubsection.paragraphs.push(...items);
    else if (currentSection) currentSection.paragraphs.push(...items);
    else introduction.push(...items);
  }

  for (const line of lines) {
    if (line.startsWith("### ")) {
      flush();
      if (!currentSection) {
        currentSection = {
          heading: "Aprofundando a reflexão",
          paragraphs: [],
          subsections: [],
        };
        sections.push(currentSection);
      }
      currentSubsection = {
        heading: line.slice(4).trim(),
        paragraphs: [],
      };
      currentSection.subsections.push(currentSubsection);
    } else if (line.startsWith("## ")) {
      flush();
      currentSubsection = null;
      currentSection = {
        heading: line.slice(3).trim(),
        paragraphs: [],
        subsections: [],
      };
      sections.push(currentSection);
    } else if (line.startsWith("- ")) {
      flush();
      buffer.push(`• ${line.slice(2).trim()}`);
      flush();
    } else if (line.startsWith("> ")) {
      flush();
      buffer.push(`“${line.slice(2).trim()}”`);
      flush();
    } else {
      buffer.push(line);
    }
  }
  flush();

  return {
    schema_version: 1,
    introduction,
    sections: sections
      .filter(
        (section) =>
          section.heading &&
          (section.paragraphs.length || section.subsections.length),
      )
      .map((section) => ({
        heading: section.heading,
        paragraphs: section.paragraphs,
        ...(section.subsections.length
          ? { subsections: section.subsections as ArticleSubsection[] }
          : {}),
      })),
    reflection: {
      title: reflectionTitle.trim() || "Uma pausa para se escutar",
      questions: reflectionQuestions
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 8),
    },
  };
}

function contentParagraphs(content: EditorialContent) {
  return [
    ...content.introduction,
    ...content.sections.flatMap((section) => [
      ...section.paragraphs,
      ...(section.subsections?.flatMap((item) => item.paragraphs) ?? []),
    ]),
  ];
}

export function countEditorialWords(content: EditorialContent) {
  return contentParagraphs(content)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function createPreviewContent(
  content: EditorialContent,
): EditorialContent {
  const totalWords = countEditorialWords(content);
  let remaining = Math.max(1, Math.floor(totalWords * 0.2));
  const introduction: string[] = [];
  const sections: ArticleSection[] = [];

  function take(value: string) {
    const words = value.trim().split(/\s+/).filter(Boolean);
    if (!remaining) return null;
    const selected = words.slice(0, remaining);
    remaining -= selected.length;
    return selected.length < words.length
      ? `${selected.join(" ")}…`
      : value;
  }

  for (const paragraph of content.introduction) {
    const selected = take(paragraph);
    if (selected) introduction.push(selected);
    if (!remaining) break;
  }

  for (const section of content.sections) {
    if (!remaining) break;
    const selectedParagraphs: string[] = [];
    const selectedSubsections: ArticleSubsection[] = [];
    for (const paragraph of section.paragraphs) {
      const selected = take(paragraph);
      if (selected) selectedParagraphs.push(selected);
      if (!remaining) break;
    }
    for (const subsection of section.subsections ?? []) {
      if (!remaining) break;
      const selectedItems: string[] = [];
      for (const paragraph of subsection.paragraphs) {
        const selected = take(paragraph);
        if (selected) selectedItems.push(selected);
        if (!remaining) break;
      }
      if (selectedItems.length) {
        selectedSubsections.push({
          heading: subsection.heading,
          paragraphs: selectedItems,
        });
      }
    }
    if (selectedParagraphs.length || selectedSubsections.length) {
      sections.push({
        heading: section.heading,
        paragraphs: selectedParagraphs,
        ...(selectedSubsections.length
          ? { subsections: selectedSubsections }
          : {}),
      });
    }
  }

  return {
    ...content,
    introduction,
    sections,
  };
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 160);
}
