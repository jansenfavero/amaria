"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  Quote,
  Save,
} from "lucide-react";
import { MediaUploader } from "@/components/admin/media-uploader";
import { saveArticleAction } from "@/app/admin/actions";

type Category = { id: string; name: string };

function insertAround(
  textarea: HTMLTextAreaElement,
  before: string,
  after = before,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selection = textarea.value.slice(start, end) || "texto";
  textarea.setRangeText(`${before}${selection}${after}`, start, end, "end");
  textarea.focus();
}

export function ArticleEditor({
  categories,
  warning,
}: {
  categories: Category[];
  warning?: string;
}) {
  const body = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState("");

  function apply(kind: string) {
    const field = body.current;
    if (!field) return;
    if (kind === "h2") insertAround(field, "\n\n## ", "\n\n");
    if (kind === "h3") insertAround(field, "\n\n### ", "\n\n");
    if (kind === "bold") insertAround(field, "**");
    if (kind === "italic") insertAround(field, "_");
    if (kind === "quote") insertAround(field, "\n\n> ", "\n\n");
    if (kind === "list") insertAround(field, "\n\n- ", "\n\n");
    if (kind === "link")
      insertAround(field, "[[Título do link|", "]]");
  }

  return (
    <form action={saveArticleAction} className="article-editor">
      {warning ? (
        <p className="admin-form-warning" role="alert">
          Revise os campos obrigatórios e tente novamente.
        </p>
      ) : null}

      <section className="editor-section">
        <div className="editor-section-heading">
          <span>01</span>
          <div>
            <h2>Essência editorial</h2>
            <p>Título, contexto e lugar deste artigo no acervo.</p>
          </div>
        </div>
        <div className="editor-grid">
          <label className="editor-field editor-span-2">
            <span>Título</span>
            <input
              name="title"
              minLength={10}
              maxLength={180}
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Um título claro, humano e editorial"
            />
          </label>
          <label className="editor-field">
            <span>Slug</span>
            <input
              name="slug"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              placeholder="gerado a partir do título"
            />
          </label>
          <label className="editor-field">
            <span>Categoria</span>
            <select name="category_id" required defaultValue="">
              <option value="" disabled>
                Escolha uma categoria
              </option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="editor-field editor-span-2">
            <span>Subtítulo</span>
            <textarea name="subtitle" rows={2} maxLength={320} />
          </label>
          <label className="editor-field editor-span-2">
            <span>Resumo para os cards</span>
            <textarea
              name="excerpt"
              rows={3}
              minLength={20}
              maxLength={420}
              required
            />
          </label>
        </div>
      </section>

      <section className="editor-section">
        <div className="editor-section-heading">
          <span>02</span>
          <div>
            <h2>Experiência multimídia</h2>
            <p>Capa obrigatória; áudio e vídeo são opcionais.</p>
          </div>
        </div>
        <div className="media-grid">
          <MediaUploader kind="image" name="hero_image_path" required />
          <MediaUploader kind="audio" name="audio_url" />
          <MediaUploader kind="video" name="video_url" />
        </div>
        <label className="editor-field">
          <span>Texto alternativo da imagem</span>
          <input
            name="hero_alt"
            maxLength={220}
            required
            placeholder="Descreva objetivamente a cena para acessibilidade"
          />
        </label>
      </section>

      <section className="editor-section">
        <div className="editor-section-heading">
          <span>03</span>
          <div>
            <h2>Corpo do artigo</h2>
            <p>
              Use títulos de seção para criar uma leitura escaneável. A prévia
              pública será gerada automaticamente com 20% do conteúdo.
            </p>
          </div>
        </div>
        <div className="editor-toolbar" aria-label="Ferramentas de edição">
          <button type="button" onClick={() => apply("h2")} title="Título de seção">
            <Heading2 aria-hidden="true" />
          </button>
          <button type="button" onClick={() => apply("h3")} title="Subtítulo">
            <Heading3 aria-hidden="true" />
          </button>
          <button type="button" onClick={() => apply("bold")} title="Negrito">
            <Bold aria-hidden="true" />
          </button>
          <button type="button" onClick={() => apply("italic")} title="Itálico">
            <Italic aria-hidden="true" />
          </button>
          <button type="button" onClick={() => apply("quote")} title="Citação">
            <Quote aria-hidden="true" />
          </button>
          <button type="button" onClick={() => apply("list")} title="Lista">
            <List aria-hidden="true" />
          </button>
          <button type="button" onClick={() => apply("link")} title="Link">
            <Link2 aria-hidden="true" />
          </button>
        </div>
        <textarea
          ref={body}
          className="editor-body"
          name="body"
          rows={24}
          minLength={120}
          required
          placeholder={"Comece com a introdução.\n\n## Primeiro tema\n\nDesenvolva a reflexão...\n\n### Um olhar mais próximo\n\nContinue aqui..."}
        />
        <div className="editor-grid">
          <label className="editor-field">
            <span>Título da pausa reflexiva</span>
            <input
              name="reflection_title"
              placeholder="Perguntas para voltar a se escutar"
            />
          </label>
          <label className="editor-field">
            <span>Perguntas reflexivas · uma por linha</span>
            <textarea name="reflection_questions" rows={4} />
          </label>
        </div>
      </section>

      <section className="editor-section">
        <div className="editor-section-heading">
          <span>04</span>
          <div>
            <h2>Publicação e descoberta</h2>
            <p>SEO, curadoria e estado editorial.</p>
          </div>
        </div>
        <div className="editor-grid">
          <label className="editor-field">
            <span>Status</span>
            <select name="status" defaultValue="draft">
              <option value="draft">Rascunho</option>
              <option value="in_review">Em revisão</option>
              <option value="ready">Pronto</option>
              <option value="scheduled">Agendado</option>
              <option value="published">Publicado</option>
            </select>
          </label>
          <label className="editor-field">
            <span>Data de publicação</span>
            <input name="published_at" type="datetime-local" />
          </label>
          <label className="editor-field editor-span-2">
            <span>Palavras-chave · separadas por vírgula</span>
            <input name="keywords" />
          </label>
          <label className="editor-field editor-span-2">
            <span>Curadoria · nomes separados por vírgula</span>
            <input name="curators" defaultValue="Léa Fávero, Juciane Carneiro" />
          </label>
          <label className="editor-field editor-span-2">
            <span>Título para SEO</span>
            <input
              name="seo_title"
              maxLength={180}
              placeholder={title || "Título do artigo"}
            />
          </label>
          <label className="editor-field editor-span-2">
            <span>Descrição para SEO</span>
            <textarea name="seo_description" rows={3} maxLength={320} />
          </label>
          <label className="auth-checkbox editor-span-2">
            <input type="checkbox" name="featured" />
            <span>Destacar este artigo no acervo.</span>
          </label>
        </div>
      </section>

      <div className="editor-submit-bar">
        <div>
          <strong>Pronto para salvar?</strong>
          <span>Você poderá revisar o status antes de publicar.</span>
        </div>
        <button type="submit" className="button button-primary">
          <Save size={18} aria-hidden="true" /> Salvar artigo
        </button>
      </div>
    </form>
  );
}
