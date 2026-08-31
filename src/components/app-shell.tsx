"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  BookHeart,
  Compass,
  Headphones,
  Heart,
  House,
  Info,
  Menu,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { Brand } from "@/components/brand";

const navigation = [
  { href: "/", label: "Para você", icon: House },
  { href: "/#temas", label: "Explorar temas", icon: Compass },
  { href: "/maria", label: "Conselheira Maria", icon: Sparkles, soon: true },
  {
    href: "/podcasts",
    label: "Áudios & podcasts",
    icon: Headphones,
    soon: true,
  },
  { href: "/comunidade", label: "Comunidade", icon: UsersRound, soon: true },
];
const essentials = [
  { href: "/sobre", label: "O que é amar.ia?", icon: Info },
  { href: "/curadoria", label: "Nossa curadoria", icon: BookHeart },
  { href: "/privacidade", label: "Privacidade & cuidado", icon: ShieldCheck },
];

function Navigation({ close }: { close?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <nav aria-label="Navegação principal" className="side-nav">
        <p className="nav-caption">SEU UNIVERSO</p>
        {navigation.map(({ href, label, icon: Icon, soon }) => (
          <Link
            key={href}
            href={href}
            onClick={close}
            className={`nav-item ${pathname === href ? "active" : ""}`}
            aria-current={pathname === href ? "page" : undefined}
          >
            <Icon size={20} strokeWidth={1.65} aria-hidden="true" />
            <span>{label}</span>
            {soon ? <span className="nav-soon">Em breve</span> : null}
          </Link>
        ))}
        <div className="nav-divider" />
        <p className="nav-caption">A AMAR.IA</p>
        {essentials.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={close}
            className={`nav-item ${pathname === href ? "active" : ""}`}
            aria-current={pathname === href ? "page" : undefined}
          >
            <Icon size={19} strokeWidth={1.65} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <Heart size={18} strokeWidth={1.4} aria-hidden="true" />
        <p>
          Para amar sem
          <br />
          se perder <em>de você.</em>
        </p>
        <span>FEITA PARA MULHERES</span>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const drawer = useRef<HTMLDialogElement>(null);
  return (
    <div className="app-shell">
      <aside className="desktop-sidebar">
        <Brand />
        <span className="brand-descriptor">INTELIGÊNCIA RELACIONAL</span>
        <Navigation />
      </aside>
      <header className="app-topbar">
        <div className="mobile-brand">
          <Brand />
        </div>
        <p className="topbar-message">
          Um encontro com a sua melhor companhia.{" "}
          <Heart size={14} aria-hidden="true" />
        </p>
        <div className="topbar-end">
          <span className="preview-badge">
            <span aria-hidden="true" /> PRÉ-LANÇAMENTO
          </span>
          <Link
            href="/sobre"
            className="topbar-symbol"
            aria-label="Conheça a AMAR.IA"
          >
            <Image src="/brand/emblem.webp" alt="" width={40} height={40} />
          </Link>
        </div>
        <button
          type="button"
          className="icon-button mobile-menu-toggle"
          aria-label="Abrir menu"
          aria-haspopup="dialog"
          aria-controls="amaria-navigation"
          onClick={() => drawer.current?.showModal()}
        >
          <Menu size={25} aria-hidden="true" />
        </button>
      </header>
      <main id="conteudo-principal" className="app-main">
        <div className="mobile-page-status">
          <span className="preview-badge">
            <span aria-hidden="true" /> PRÉ-LANÇAMENTO
          </span>
        </div>
        {children}
      </main>
      <dialog
        ref={drawer}
        id="amaria-navigation"
        className="mobile-drawer"
        aria-label="Menu da AMAR.IA"
        onClick={(event) => {
          if (event.target === event.currentTarget) drawer.current?.close();
        }}
      >
        <div className="drawer-inner">
          <div className="drawer-heading">
            <Brand />
            <button
              type="button"
              className="icon-button"
              aria-label="Fechar menu"
              onClick={() => drawer.current?.close()}
            >
              <X size={23} />
            </button>
          </div>
          <Navigation close={() => drawer.current?.close()} />
        </div>
      </dialog>
      <nav className="mobile-bottom-nav" aria-label="Atalhos">
        <Link href="/">
          <House size={21} aria-hidden="true" />
          <span>Início</span>
        </Link>
        <Link href="/#temas">
          <Compass size={21} aria-hidden="true" />
          <span>Explorar</span>
        </Link>
        <Link href="/maria">
          <Sparkles size={21} aria-hidden="true" />
          <span>Maria</span>
        </Link>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-controls="amaria-navigation"
          onClick={() => drawer.current?.showModal()}
        >
          <Menu size={21} aria-hidden="true" />
          <span>Menu</span>
        </button>
      </nav>
    </div>
  );
}

export function RightRail() {
  return (
    <aside className="right-rail" aria-label="Explore a AMAR.IA">
      <section className="maria-preview">
        <div className="rail-top">
          <span className="eyebrow">CONSELHEIRA MARIA</span>
          <span className="small-pill">EM BREVE</span>
        </div>
        <div className="maria-symbol">
          <Image src="/brand/emblem.webp" alt="" width={126} height={126} />
        </div>
        <h2>
          Um novo olhar.
          <br />
          <em>Uma conversa sua.</em>
        </h2>
        <p>
          Uma IA pensada para acompanhar suas reflexões sobre os vínculos da
          vida.
        </p>
        <Link href="/maria" className="button button-light">
          Conheça a Maria <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
        <span className="rail-footnote">IA para reflexão. Não é terapia.</span>
      </section>
      <section className="daily-note">
        <span className="eyebrow">PARA LEVAR COM VOCÊ</span>
        <span className="quote-mark" aria-hidden="true">
          “
        </span>
        <p>
          Você não precisa
          <br />
          ser menos você
          <br />
          para caber no amor.
        </p>
        <div className="note-signature">
          <span /> amar.ia
        </div>
      </section>
      <Link href="/comunidade" className="community-preview">
        <span className="round-icon">
          <UsersRound size={22} aria-hidden="true" />
        </span>
        <div>
          <strong>Juntas, em breve.</strong>
          <p>Conheça a nossa comunidade</p>
        </div>
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
      <footer className="rail-footer">
        <Link href="/sobre">Sobre</Link>
        <Link href="/curadoria">Curadoria</Link>
        <Link href="/privacidade">Privacidade</Link>
        <p>© AMAR.IA · Amar é também se escolher.</p>
      </footer>
    </aside>
  );
}
