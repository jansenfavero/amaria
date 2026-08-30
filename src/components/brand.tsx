import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return (
    <Link
      className="brand"
      href="/#inicio"
      aria-label="AMAR.IA — página inicial"
    >
      <Image
        src="/brand/emblem.webp"
        alt=""
        width={48}
        height={48}
        className="brand-icon"
      />
      <span className="wordmark">
        amar<span className="wordmark-dot">.</span>ia
      </span>
    </Link>
  );
}
