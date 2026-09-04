"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle, UserRoundPlus } from "lucide-react";
import { registerMemberAction } from "@/app/api/membership/actions";
import type { Account } from "@/lib/auth/server";

interface MemberRegisterFormProps {
  account: Account | null;
}

const initialState = { kind: "idle", message: "" };

export function MemberRegisterForm({ account }: MemberRegisterFormProps) {
  const [state, action, pending] = useActionState(registerMemberAction, initialState);

  if (!account) {
    return (
      <div className="member-register-notice">
        <UserRoundPlus size={48} />
        <h2>Crie sua conta gratuita</h2>
        <p>Para se tornar membro da AMARIA, você precisa primeiro criar uma conta na plataforma.</p>
        <Link href="/cadastro" className="button button-primary">
          Criar conta grátis <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="member-register-form">
      <div className="form-header">
        <h2>Complete seu cadastro como membro</h2>
        <p>Preencha as informações abaixo para se tornar parte da comunidade AMARIA.</p>
      </div>

      <div className="form-field">
        <label htmlFor="display_name">Nome de exibição *</label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          minLength={2}
          maxLength={100}
          placeholder="Como você quer ser chamada na comunidade"
          required
          disabled={pending}
          autoComplete="name"
        />
      </div>

      <div className="form-field">
        <label htmlFor="bio">Sobre você</label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={500}
          placeholder="Conte um pouco sobre você (opcional)"
          disabled={pending}
        />
        <span className="field-hint">Máximo de 500 caracteres</span>
      </div>

      <div className="form-field founding-member-field">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="is_founding_member"
            disabled={pending}
          />
          <span>
            <strong>Quero ser Membro Fundadora</strong>
            <p>As 100 primeiras membros terão benefícios e acessos exclusivos na plataforma.</p>
          </span>
        </label>
      </div>

      {state.message && (
        <p
          className={`form-message form-message-${state.kind}`}
          role={state.kind === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        className="button button-primary"
        disabled={pending}
      >
        {pending ? (
          <>
            <LoaderCircle className="spinner" size={20} aria-hidden="true" />
            Processando...
          </>
        ) : (
          <>
            Tornar-se membro <ArrowRight size={18} />
          </>
        )}
      </button>

      <p className="form-note">
        Seu cadastro é gratuito e você terá acesso imediato aos benefícios de membro.
      </p>
    </form>
  );
}
