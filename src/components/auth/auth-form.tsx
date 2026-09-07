"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import {
  recoverAccessAction,
  setPasswordAction,
  signInAction,
  signUpAction,
} from "@/app/auth/actions";
import type { AuthFormState } from "@/lib/auth/policy";

type Mode = "login" | "signup" | "recover" | "password";
const initialState: AuthFormState = { kind: "idle", message: "" };
const actions = {
  login: signInAction,
  signup: signUpAction,
  recover: recoverAccessAction,
  password: setPasswordAction,
};

export function AuthForm({ mode, next = "/meu-perfil" }: { mode: Mode; next?: string }) {
  const [state, action, pending] = useActionState(actions[mode], initialState);
  const [showPassword, setShowPassword] = useState(false);
  const feedback = useRef<HTMLParagraphElement>(null);
  const signup = mode === "signup";
  const passwordMode = mode === "password";

  useEffect(() => {
    if (state.message) feedback.current?.focus();
  }, [state]);

  return (
    <form action={action} className="auth-form" aria-busy={pending}>
      <input type="hidden" name="next" value={next} />
      {signup ? (
        <div className="auth-field">
          <label htmlFor="display_name">Como você gosta de ser chamada?</label>
          <input
            id="display_name"
            name="display_name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={80}
            placeholder="Seu nome"
            required
            disabled={pending}
          />
        </div>
      ) : null}

      {!passwordMode ? (
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
            placeholder="voce@exemplo.com"
            required
            disabled={pending}
          />
        </div>
      ) : null}

      {mode !== "recover" ? (
        <div className="auth-field">
          <label htmlFor="password">
            {passwordMode ? "Nova senha" : signup ? "Crie uma senha" : "Senha"}
          </label>
          <div className="auth-password">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={
                passwordMode || signup ? "new-password" : "current-password"
              }
              minLength={passwordMode || signup ? 12 : undefined}
              maxLength={passwordMode || signup ? 72 : 256}
              aria-describedby={
                passwordMode || signup ? "password-hint" : undefined
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
          {passwordMode || signup ? (
            <p id="password-hint" className="auth-hint">
              Use ao menos 12 caracteres. Uma frase longa, única e fácil de
              lembrar costuma ser mais segura.
            </p>
          ) : null}
        </div>
      ) : null}

      {passwordMode || signup ? (
        <div className="auth-field">
          <label htmlFor="confirmation">Confirme a senha</label>
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
      ) : null}

      {passwordMode || signup ? (
        <label className="auth-checkbox">
          <input type="checkbox" name="privacy" required disabled={pending} />
          <span>
            Li e aceito o{" "}
            <Link
              href="/privacidade"
              target="_blank"
              rel="noopener noreferrer"
            >
              aviso de privacidade (abre em outra aba)
            </Link>{" "}
            para criar e proteger meu perfil.
          </span>
        </label>
      ) : null}

      {signup ? (
        <label className="auth-checkbox">
          <input type="checkbox" name="marketing" disabled={pending} />
          <span>
            Quero receber novidades editoriais e convites da AMARIA. Posso
            mudar esta escolha no Meu Perfil.
          </span>
        </label>
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
        disabled={pending || state.kind === "success"}
      >
        {pending ? (
          <>
            <LoaderCircle className="auth-spinner" size={20} aria-hidden="true" />
            Aguarde…
          </>
        ) : (
          <>
            {mode === "login"
              ? "Entrar"
              : mode === "signup"
                ? "Criar meu perfil gratuito"
                : mode === "recover"
                  ? "Solicitar recuperação"
                  : "Salvar nova senha"}
            <ArrowRight size={19} aria-hidden="true" />
          </>
        )}
      </button>

      <p className="auth-form-note">
        {mode === "login"
          ? "Ainda não é membro? Crie gratuitamente seu espaço na AMARIA."
          : mode === "signup"
            ? "Seu cadastro é gratuito. Enviaremos um link para confirmar que o e-mail é seu."
            : mode === "recover"
              ? "Por segurança, não informamos se um endereço já está cadastrado."
              : "Depois de salvar, entre novamente com sua nova senha."}
      </p>

      {mode === "login" ? (
        <Link href="/cadastro" className="auth-text-link">
          Quero ser membro
        </Link>
      ) : mode !== "password" && mode !== "recover" ? (
        <Link href="/entrar" className="auth-text-link">
          Já tenho perfil
        </Link>
      ) : (
        <Link href="/entrar" className="auth-text-link">
          Voltar para entrar
        </Link>
      )}
    </form>
  );
}
