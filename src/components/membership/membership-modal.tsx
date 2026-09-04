"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Sparkles, Users, CalendarHeart, ArrowRight, UserRoundPlus } from "lucide-react";

interface MembershipModalProps {
  onOpenRegister: () => void;
}

export function MembershipModal({ onOpenRegister }: MembershipModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Show modal after 5 seconds
    const timer = setTimeout(() => {
      // Check if user has already seen this modal
      const hasSeenModal = localStorage.getItem("amaria_membership_modal_seen");
      if (!hasSeenModal) {
        setIsVisible(true);
        modalRef.current?.showModal();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("amaria_membership_modal_seen", "true");
    modalRef.current?.close();
  };

  return (
    <dialog
      ref={modalRef}
      className="membership-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="membership-modal-inner">
        <button
          type="button"
          className="membership-modal-close"
          onClick={handleClose}
          aria-label="Fechar"
        >
          <X size={24} />
        </button>

        <div className="membership-modal-image">
          <Image
            src="/brand/woman-reading-mobile.webp"
            alt="Mulher acessando a AMARIA em seu smartphone"
            width={400}
            height={300}
            priority
          />
        </div>

        <div className="membership-modal-content">
          <h2>Seja membro gratuito da AMARIA</h2>
          <p className="modal-intro">
            Acesse conteúdos completos sobre relacionamentos, autoconhecimento 
            e inteligência relacional feminina.
          </p>

          <div className="membership-benefits">
            <div className="benefit-item">
              <Sparkles size={20} className="benefit-icon" />
              <div>
                <strong>Maria - Sua Conselheira IA</strong>
                <p>Em breve: uma inteligência artificial pensada para acompanhar 
                suas reflexões sobre os vínculos da vida. Não é terapia, é um 
                espaço de organização de pensamentos.</p>
              </div>
            </div>

            <div className="benefit-item">
              <Users size={20} className="benefit-icon" />
              <div>
                <strong>Comunidade Interativa</strong>
                <p>Conecte-se com outras mulheres, compartilhe experiências 
                e cresça juntas em nossa comunidade exclusiva.</p>
              </div>
            </div>

            <div className="benefit-item">
              <CalendarHeart size={20} className="benefit-icon" />
              <div>
                <strong>Encontros e Eventos</strong>
                <p>Participe de encontros virtuais e presenciais com membros 
                da plataforma. Rodas de conversa, workshops e muito mais.</p>
              </div>
            </div>
          </div>

          <div className="founding-member-callout">
            <UserRoundPlus size={28} />
            <div>
              <strong>Seja uma Membro Fundadora</strong>
              <p>As 100 primeiras membros terão benefícios e acessos exclusivos 
              na plataforma, incluindo acesso antecipado a novos recursos e 
              participação em decisões da comunidade.</p>
            </div>
          </div>

          <div className="membership-modal-actions">
            <Link href="/cadastro" className="button button-primary" onClick={handleClose}>
              Quero ser membro fundadora <ArrowRight size={18} />
            </Link>
            <button type="button" className="button button-secondary" onClick={handleClose}>
              Ver depois
            </button>
          </div>

          <p className="modal-footer-note">
            Cadastro gratuito · Sem compromisso · Cancele quando quiser
          </p>
        </div>
      </div>
    </dialog>
  );
}
