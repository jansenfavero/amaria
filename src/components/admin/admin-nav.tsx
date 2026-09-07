import Link from "next/link";
import {
  BarChart3,
  BookOpenText,
  MessageCircleHeart,
  PlusCircle,
  UsersRound,
} from "lucide-react";

export function AdminNav() {
  return (
    <nav className="admin-nav" aria-label="Administração">
      <Link href="/admin"><BarChart3 aria-hidden="true" /> Visão geral</Link>
      <Link href="/admin/conteudos"><BookOpenText aria-hidden="true" /> Conteúdos</Link>
      <Link href="/admin/conteudos/novo"><PlusCircle aria-hidden="true" /> Novo artigo</Link>
      <Link href="/admin/membros"><UsersRound aria-hidden="true" /> Membros</Link>
      <Link href="/admin/comentarios"><MessageCircleHeart aria-hidden="true" /> Comentários</Link>
    </nav>
  );
}

