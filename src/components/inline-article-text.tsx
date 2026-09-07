import Link from "next/link";

const linkMarker = /\[\[([^|]+)\|([^\]]+)\]\]/g;
const emphasisMarker = /(\*\*[^*]+\*\*|_[^_]+_)/g;

function formattedText(value: string, key: string) {
  return value.split(emphasisMarker).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${key}-strong-${index}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("_") && part.endsWith("_")) {
      return <em key={`${key}-em-${index}`}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function safeHref(value: string) {
  return value.startsWith("/") || /^https:\/\/[a-z0-9.-]+(?:\/|$)/i.test(value);
}

export function InlineArticleText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(linkMarker)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      parts.push(...formattedText(text.slice(cursor, index), `text-${index}`));
    }
    if (safeHref(match[2])) {
      parts.push(
        <Link
          href={match[2]}
          key={`${index}-${match[2]}`}
          {...(match[2].startsWith("https://")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {formattedText(match[1], `link-${index}`)}
        </Link>,
      );
    } else {
      parts.push(match[1]);
    }
    cursor = index + match[0].length;
  }

  if (cursor < text.length) {
    parts.push(...formattedText(text.slice(cursor), `tail-${cursor}`));
  }
  return <>{parts}</>;
}

