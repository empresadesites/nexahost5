import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Como funciona o processo de contratação e ativação manual da VPS?',
      answer:
        'O processo é totalmente direto: você escolhe seu plano, preenche seus dados de contato básicos (Nome, WhatsApp, E-mail), realiza a transferência via PIX e fornece o nome e IP desejado. Nossa equipe técnica recebe seu pedido e realiza a configuração física e provisionamento da máquina em média entre 15 a 45 minutos no horário comercial.',
    },
    {
      question: 'Por que o pagamento é feito via PIX manual?',
      answer:
        'Optamos pelo PIX manual direto para evitar taxas abusivas de gateways de cartão de crédito e repassar essa economia diretamente em preços mais baixos para você! Além disso, a conferência direta garante validação personalizada por nossa equipe.',
    },
    {
      question: 'Como eu acesso a minha VPS após a ativação?',
      answer:
        'Assim que ativada, você receberá a confirmação no WhatsApp/E-mail e poderá acompanhar pelo status do pedido. O acesso é feito via SSH (para distribuições Linux como Ubuntu e Debian) ou Conexão de Área de Trabalho Remota - RDP (para Windows Server), com privilégios de Administrador / Root total.',
    },
    {
      question: 'Posso usar a VPS para servidores de FiveM, Minecraft e Bots Discord?',
      answer:
        'Com certeza! Nossos processadores Xeon com alto clock e discos NVMe são perfeitos para servidores de jogos e bots. Para FiveM, recomendamos planos a partir de 8 GB RAM (Nexa Advanced). Para bots Discord e aplicações web, planos como Nexa Start (4 GB) operam com folga.',
    },
    {
      question: 'A proteção Anti-DDoS está inclusa?',
      answer:
        'Sim, 100% dos nossos planos contam com proteção Anti-DDoS Anycast inclusa de até 4.8 Tbps, mitigando ataques volumétricos L3, L4 e L7 automaticamente para manter seu serviço sempre online.',
    },
    {
      question: 'Onde ficam localizados os servidores?',
      answer:
        'Contamos com nós de processamento em São Paulo (Brasil), oferecendo latências extremamente baixas (geralmente abaixo de 10-15ms para o território nacional), além de opções em Ashburn (Virgínia, EUA).',
    },
  ];

  return (
    <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>DÚVIDAS FREQUENTES</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Perguntas Frequentes
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Tudo o que você precisa saber sobre nossos planos, pagamento e infraestrutura.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl glass-card border border-slate-800/90 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-bold text-white hover:text-cyan-300 transition-colors focus:outline-none cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-cyan-300' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/40 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
