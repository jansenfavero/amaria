"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import {
  recoverAccessAction,
  setPasswordAction,
  signInAction,
} from "@/app/auth/actions";
import type { AuthFormState } from "@/lib/auth/policy";

type Mode = "login" | "recover" | "password";
const initialState: AuthFormState = { kind: "idle", message: "" };
const actions = {
  login: signInAction,
  recover: recoverAccessAction,
  password: setPasswordAction,
};

export function AuthForm({ mode }: { mode: Mode }) {
  const [state, action, pending] = useActionState(actions[mode], initialState);
  const [showPassword, setShowPassword] = useState(false);
  const feedback = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.message) feedback.current?.focus();
  }, [state]);

  return (
    <form action={action} className="auth-form" aria-busy={pending}>
      {mode !== "password" ? (
        <div className="auth-field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={254}
            placeholder="Seu e-mail de acesso"
            required
            disabled={pending}
          />
        </div>
      ) : null}
      {mode !== "recover" ? (
        <div className="auth-field">
          <label htmlFor="password">
            {mode === "password" ? "Nova senha" : "Senha"}
          </label>
          <div className="auth-password">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={
                mode === "password" ? "new-password" : "current-password"
              }
              minLength={mode === "password" ? 12 : undefined}
              maxLength={mode === "password" ? 72 : 256}
              aria-describedby={
                mode === "password" ? "password-hint" : undefined
              }
              required
              disabled={pending}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
              disabled={pending}
            >
              {showPassword ? (
                <EyeOff size={21} aria-hidden="true" />
              ) : (
                <Eye size={21} aria-hidden="true" />
              )}
            </button>
          </div>
          {mode === "password" ? (
            <p id="password-hint" className="auth-hint">
              Use pelo menos 12 caracteres. Prefira uma frase longa, única e
              difícil de adivinhar. Limite: 72 bytes; acentos e emojis podem
              ocupar mais de um.
            </p>
          ) : null}
        </div>
      ) : null}
      {mode === "password" ? (
        <>
          <div className="auth-field">
            <label htmlFor="confirmation">Confirme a nova senha</label>
            <input
              id="confirmation"
              name="confirmation"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={12}
              maxLength={72}
              required
              disabled={pending}
            />
          </div>
          <label className="auth-checkbox">
            <input type="checkbox" name="privacy" required disabled={pending} />
            <span>
              Li o{" "}
              <Link
                href="/privacidade#equipe"
                target="_blank"
                rel="noopener noreferrer"
              >
                aviso de privacidade do acesso da equipe (abre em outra aba)
              </Link>{" "}
              e estou ciente do uso dos meus dados para este acesso.
            </span>
          </label>
        </>
      ) : null}
      {mode === "login" ? (
        <Link className="auth-text-link auth-recovery" href="/recuperar-acesso">
          Esqueci minha senha
        </Link>
      ) : null}
      {state.message ? (
        <p
          ref={feedback}
          tabIndex={-1}
          className={`auth-message auth-message-${state.kind}`}
          role={state.kind === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}
      <button
        className="button button-primary auth-submit"
        type="submit"
        disabled={pending}
      >
        {pending ? (
          <>
            <LoaderCircle
              className="auth-spinner"
              size={20}
              aria-hidden="true"
            />
            Aguarde…
          </>
        ) : (
          <>
            {mode === "login"
              ? "Entrar na minha conta"
              : mode === "recover"
                ? "Solicitar recuperação"
                : "Salvar nova senha"}
            <ArrowRight size={19} aria-hidden="true" />
          </>
        )}
      </button>
      <p className="auth-form-note">
        {mode === "login"
          ? "O acesso é exclusivo para pessoas convidadas da equipe. Ainda não há cadastro público."
          : mode === "recover"
            ? "A recuperação não cria uma nova conta. Utilize o e-mail do seu convite."
            : "Depois de salvar, suas sessões serão encerradas. Entre novamente com a nova senha."}
      </p>
      {mode !== "login" ? (
        <Link href="/entrar" className="auth-text-link">
          Voltar para entrar
        </Link>
      ) : null}
    </form>
  );
}
