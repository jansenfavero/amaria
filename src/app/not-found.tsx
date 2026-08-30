import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand";

export default function NotFound() {
  return (
    <main className="message-page">
      <Brand />
      <p className="eyebrow">404 · PÁGINA NÃO ENCONTRADA</p>
      <h1>
        Vamos voltar
        <br />
        <em>ao começo?</em>
      </h1>
      <p>
        Esse endereço não está disponível. A AMAR.IA ainda está em construção.
      </p>
      <Link href="/" className="button button-primary">
        <ArrowLeft size={18} aria-hidden="true" /> Voltar à página inicial
      </Link>
    </main>
  );
}
