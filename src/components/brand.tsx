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
        src="/brand/logo-horizontal.png"
        alt=""
        width={636}
        height={207}
        className="brand-logo"
      />
    </Link>
  );
}
