import Link from "next/link";

const linkMarker = /\[\[([^|]+)\|([^\]]+)\]\]/g;

export function InlineArticleText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(linkMarker)) {
    const index = match.index ?? 0;
    if (index > cursor) parts.push(text.slice(cursor, index));
    parts.push(
      <Link href={match[2]} key={`${index}-${match[2]}`}>
        {match[1]}
      </Link>,
    );
    cursor = index + match[0].length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}
