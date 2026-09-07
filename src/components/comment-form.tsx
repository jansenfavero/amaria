"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import {
  createCommentAction,
  type CommentState,
} from "@/app/conteudos/actions";

const initialState: CommentState = { kind: "idle", message: "" };

export function CommentForm({ articleSlug }: { articleSlug: string }) {
  const [state, action, pending] = useActionState(
    createCommentAction,
    initialState,
  );
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.kind === "success") form.current?.reset();
  }, [state.kind]);

  return (
    <form ref={form} action={action} className="comment-form">
      <input type="hidden" name="article_slug" value={articleSlug} />
      <label htmlFor="comment-body">Compartilhe sua reflexão</label>
      <textarea
        id="comment-body"
        name="body"
        minLength={3}
        maxLength={2000}
        rows={4}
        placeholder="Escreva com gentileza. Este é um espaço de troca, não de julgamento."
        required
        disabled={pending}
      />
      <div>
        <span>Até 2.000 caracteres</span>
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? "Publicando…" : "Comentar"}
          <Send size={16} aria-hidden="true" />
        </button>
      </div>
      {state.message ? (
        <p
          className={`comment-feedback ${state.kind}`}
          role={state.kind === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

