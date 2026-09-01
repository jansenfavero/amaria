"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ReceiveLink() {
  const router = useRouter();
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function confirm() {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    const hash = new URLSearchParams(window.location.hash.slice(1));
    window.history.replaceState(null, "", "/auth/receber");
    const access_token = hash.get("access_token");
    const refresh_token = hash.get("refresh_token");
    try {
      if (!access_token || !refresh_token || hash.has("error")) {
        throw new Error("invalid-link");
      }
      const supabase = createClient();
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      if (error) throw new Error("invalid-link");
      router.replace("/definir-senha");
      router.refresh();
    } catch {
      setMessage(
        "Este link está incompleto, expirou ou já foi utilizado. Solicite outro link. Nunca compartilhe links de acesso.",
      );
      setPending(false);
    }
  }

  return (
    <div className="auth-form">
      {message ? (
        <>
          <p className="auth-message auth-message-error" role="alert">
            {message}
          </p>
          <Link
            href="/recuperar-acesso"
            className="button button-primary auth-submit"
          >
            Recuperar meu acesso
          </Link>
        </>
      ) : (
        <button
          type="button"
          className="button button-primary auth-submit"
          onClick={confirm}
          disabled={pending}
        >
          {pending ? "Verificando seu acesso…" : "Confirmar meu acesso"}
        </button>
      )}
      <p className="auth-form-note">
        Continue apenas se você solicitou a recuperação ou recebeu um convite da
        administração da AMAR.IA.
      </p>
      <Link href="/entrar" className="auth-text-link">
        Voltar para entrar
      </Link>
    </div>
  );
}
