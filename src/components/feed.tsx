"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Flower2,
  Heart,
  Leaf,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { RightRail } from "@/components/app-shell";
import {
  posts,
  topics,
  type EditorialPost,
  type TopicId,
} from "@/lib/editorial";

const topicIcons = [Heart, ShieldCheck, UsersRound, Leaf];

export function Feed() {
  const [topic, setTopic] = useState<TopicId | "all">("all");
  const [liked, setLiked] = useState<Set<string>>(() => new Set());
  const [onlyLiked, setOnlyLiked] = useState(false);
  const [notice, setNotice] = useState("");
  const [detail, setDetail] = useState<{
    post: EditorialPost;
    mode: "read" | "comments" | "share";
  } | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const visiblePosts = posts.filter(
    (post) =>
      (topic === "all" || post.topic === topic) &&
      (!onlyLiked || liked.has(post.id)),
  );

  function openDetail(
    post: EditorialPost,
    mode: "read" | "comments" | "share",
  ) {
    setDetail({ post, mode });
    dialog.current?.showModal();
  }

  function toggleLike(post: EditorialPost) {
    const removing = liked.has(post.id);
    setLiked((previous) => {
      const next = new Set(previous);
      if (next.has(post.id)) next.delete(post.id);
      else next.add(post.id);
      return next;
    });
    setNotice(
      removing
        ? "Curtida removida."
        : "Você curtiu esta reflexão. Ela fica nos seus curtidos durante esta visita.",
    );
  }

  async function share(post: EditorialPost) {
    const url = `${window.location.origin}/#${post.id}`;
    setShareUrl(url);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.title} | AMAR.IA`,
          text: "Uma reflexão da AMAR.IA para você.",
          url,
        });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setNotice("Link copiado. Agora é só compartilhar com quem você quiser.");
    } catch {
      openDetail(post, "share");
    }
  }

  return (
    <div className="content-grid" id="inicio">
      <div className="feed-column">
        <section className="feed-welcome">
          <div>
            <p className="eyebrow">
              <Sparkles size={13} aria-hidden="true" /> BEM-VINDA AO SEU ESPAÇO
            </p>
            <h1>
              Mais perto <em>de você.</em>
            </h1>
            <p>Inspirações para se descobrir. Conexões para florescer.</p>
          </div>
          <span className="welcome-flower" aria-hidden="true">
            <Flower2 size={48} strokeWidth={1} />
          </span>
        </section>
        <section
          className="topics-section"
          id="temas"
          aria-labelledby="topics-title"
        >
          <div className="section-heading">
            <h2 id="topics-title">O que faz sentido para você hoje?</h2>
            <span>EXPLORE</span>
          </div>
          <div className="topic-grid">
            {topics.map((item, index) => {
              const Icon = topicIcons[index];
              return (
                <button
                  type="button"
                  key={item.id}
                  className={`topic-card tone-${item.tone} ${topic === item.id ? "selected" : ""}`}
                  aria-pressed={topic === item.id}
                  onClick={() => {
                    setTopic(topic === item.id ? "all" : item.id);
                    setOnlyLiked(false);
                  }}
                >
                  <span className="topic-icon">
                    <Icon size={22} strokeWidth={1.35} aria-hidden="true" />
                  </span>
                  <strong>{item.name}</strong>
                  <span>{item.caption}</span>
                  <ChevronRight
                    className="topic-arrow"
                    size={14}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </section>
        <div className="feed-toolbar">
          <div className="feed-tabs" role="group" aria-label="Filtrar o feed">
            <button
              type="button"
              className={!onlyLiked ? "selected" : ""}
              aria-pressed={!onlyLiked}
              onClick={() => {
                setOnlyLiked(false);
                setTopic("all");
              }}
            >
              <Sparkles size={16} aria-hidden="true" /> Para você
            </button>
            <button
              type="button"
              className={onlyLiked ? "selected" : ""}
              aria-pressed={onlyLiked}
              onClick={() => {
                setOnlyLiked(true);
                setTopic("all");
              }}
            >
              <Heart size={16} aria-hidden="true" /> Curtidos{" "}
              {liked.size > 0 ? (
                <span className="liked-count">{liked.size}</span>
              ) : null}
            </button>
          </div>
          <span className="feed-edition">
            PRIMEIRAS REFLEXÕES <ArrowDown size={12} aria-hidden="true" />
          </span>
        </div>
        {topic !== "all" ? (
          <div className="filter-summary">
            <span>
              {topics.find((item) => item.id === topic)?.name} ·{" "}
              {visiblePosts.length} reflexão
            </span>
            <button type="button" onClick={() => setTopic("all")}>
              Ver todos os temas <X size={13} aria-hidden="true" />
            </button>
          </div>
        ) : null}
        <p className="feed-disclosure">
          Prévias editoriais · Curtidas apenas nesta visita · Comentários em
          breve
        </p>
        <div className="posts-list" aria-label="Reflexões da AMAR.IA">
          {visiblePosts.length === 0 ? (
            <div className="empty-state">
              <Heart size={34} strokeWidth={1.3} aria-hidden="true" />
              <h2>Guarde o que toca você.</h2>
              <p>
                Toque no coração de uma reflexão para encontrá-la aqui durante
                esta visita.
              </p>
              <button
                type="button"
                className="button button-primary"
                onClick={() => {
                  setOnlyLiked(false);
                  setTopic("all");
                }}
              >
                Explorar reflexões <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          ) : (
            visiblePosts.map((post) => (
              <article
                key={post.id}
                id={post.id}
                className="post-card"
                aria-labelledby={`${post.id}-title`}
              >
                <header className="post-header">
                  <Image
                    className="editorial-avatar"
                    src="/brand/emblem.webp"
                    alt=""
                    width={40}
                    height={40}
                  />
                  <div>
                    <strong>
                      amar.ia{" "}
                      <span className="editorial-star" aria-hidden="true">
                        ✦
                      </span>
                    </strong>
                    <span>Um espaço de inteligência relacional</span>
                  </div>
                  <span
                    className={`post-topic tone-${topics.find((item) => item.id === post.topic)?.tone}`}
                  >
                    {topics.find((item) => item.id === post.topic)?.name}
                  </span>
                </header>
                <div className={`post-art art-${post.tone}`}>
                  <span className="art-topline">
                    <span>{post.kicker}</span>
                    <span>REFLEXÃO / {post.number}</span>
                  </span>
                  <h2 id={`${post.id}-title`}>{post.title}</h2>
                  <span className="art-bottomline">
                    <span>PARA AMAR SEM SE PERDER DE VOCÊ</span>
                    <span className="art-wordmark">
                      amar.ia <span aria-hidden="true">✦</span>
                    </span>
                  </span>
                  <button
                    type="button"
                    className="post-art-link"
                    onClick={() => openDetail(post, "read")}
                    aria-label={`Ler reflexão: ${post.title}`}
                    aria-haspopup="dialog"
                  />
                </div>
                <div className="post-body">
                  <p>{post.excerpt}</p>
                  <button
                    type="button"
                    className="read-link"
                    onClick={() => openDetail(post, "read")}
                  >
                    Continuar a reflexão{" "}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </button>
                </div>
                <footer className="post-actions">
                  <button
                    type="button"
                    className={liked.has(post.id) ? "is-liked" : ""}
                    aria-pressed={liked.has(post.id)}
                    aria-label={`${liked.has(post.id) ? "Descurtir" : "Curtir"}: ${post.title}`}
                    onClick={() => toggleLike(post)}
                  >
                    <Heart
                      size={21}
                      strokeWidth={1.6}
                      fill={liked.has(post.id) ? "currentColor" : "none"}
                      aria-hidden="true"
                    />
                    <span>{liked.has(post.id) ? "Curtido" : "Curtir"}</span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Comentar: ${post.title}`}
                    aria-haspopup="dialog"
                    onClick={() => openDetail(post, "comments")}
                  >
                    <MessageCircle
                      size={21}
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                    <span>Comentar</span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Compartilhar: ${post.title}`}
                    onClick={() => void share(post)}
                  >
                    <Share2 size={20} strokeWidth={1.6} aria-hidden="true" />
                    <span>Compartilhar</span>
                  </button>
                </footer>
              </article>
            ))
          )}
        </div>
        <div className="feed-end">
          <span>✦</span>
          <p>Por hoje, fique com o que fez sentido.</p>
          <Link href="/sobre">
            Este é só o começo da AMAR.IA{" "}
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <RightRail />
      <div
        className={`toast ${notice ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice ? (
          <>
            <Check size={18} aria-hidden="true" />
            <p>{notice}</p>
            <button
              type="button"
              aria-label="Fechar aviso"
              onClick={() => setNotice("")}
            >
              <X size={17} />
            </button>
          </>
        ) : null}
      </div>
      <dialog
        ref={dialog}
        className="content-dialog"
        aria-labelledby="detail-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="dialog-inner">
          <button
            type="button"
            className="icon-button dialog-close"
            aria-label="Fechar janela"
            onClick={() => dialog.current?.close()}
          >
            <X size={23} />
          </button>
          {detail?.mode === "read" ? (
            <>
              <span className="eyebrow">AMAR.IA · PRÉVIA EDITORIAL</span>
              <h2 id="detail-title">{detail.post.title}</h2>
              {detail.post.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="reflection-question">
                <Sparkles size={20} aria-hidden="true" />
                <span>Uma pergunta para levar com você</span>
                <strong>{detail.post.question}</strong>
              </div>
              <p className="dialog-note">
                Texto de apresentação dos temas. Ainda não integra o acervo
                revisado pela curadoria. Não substitui acompanhamento
                profissional.
              </p>
            </>
          ) : detail?.mode === "comments" ? (
            <>
              <span className="dialog-symbol">
                <MessageCircle size={28} aria-hidden="true" />
              </span>
              <span className="eyebrow">CONEXÕES COM CUIDADO</span>
              <h2 id="detail-title">
                Toda conversa merece
                <br />
                <em>um espaço seguro.</em>
              </h2>
              <p>
                Os comentários ainda não estão disponíveis. Vamos abrir esse
                espaço com contas, regras de convivência e moderação preparadas
                para acolher as trocas.
              </p>
              <p>
                Nesta prévia, você pode ler, curtir durante a visita e
                compartilhar as reflexões. Nenhum comentário é coletado ou
                publicado.
              </p>
              <Link href="/comunidade" className="button button-primary">
                Conheça a proposta <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </>
          ) : (
            <>
              <span className="eyebrow">COMPARTILHAR REFLEXÃO</span>
              <h2 id="detail-title">Leve esta conversa adiante.</h2>
              <p>
                Não foi possível copiar automaticamente. Selecione e copie o
                endereço abaixo:
              </p>
              <p className="share-url">{shareUrl}</p>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
