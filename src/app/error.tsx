"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="message-page">
      <p className="eyebrow">AMARIA</p>
      <h1>Uma pequena pausa.</h1>
      <p>
        Não foi possível carregar esta página agora. Tente novamente em
        instantes.
      </p>
      <button type="button" onClick={reset} className="button button-primary">
        Tentar novamente
      </button>
      <Link href="/" className="text-link">
        Voltar ao início
      </Link>
    </main>
  );
}
