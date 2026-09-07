import Image from "next/image";
import { Sparkles } from "lucide-react";

export function PageHero({ eyebrow, title, description, image, imageAlt = "", children, compact = false }: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <header className={`page-hero ${compact ? "is-compact" : ""}`}>
      <Image className="page-hero-image" src={image} alt={imageAlt} fill priority sizes="(max-width: 760px) calc(100vw - 32px), 1120px" />
      <span className="page-hero-shade" aria-hidden="true" />
      <div className="page-hero-copy">
        <p className="page-hero-eyebrow"><Sparkles size={14} aria-hidden="true" /> {eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        {children ? <div className="page-hero-actions">{children}</div> : null}
      </div>
    </header>
  );
}
