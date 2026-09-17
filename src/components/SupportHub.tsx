import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  User,
  Bot,
  Send,
  Headphones,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
  Hash,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Ticket, TicketCategory, TicketStatus, SiteSettings } from '../types';
import { storageService } from '../services/storage';
import { aiService, AIMessage } from '../services/ai_service';

interface SupportHubProps {
  settings: SiteSettings;
  initialOrderRef?: string;
}

export const SupportHub: React.FC<SupportHubProps> = ({
  settings,
  initialOrderRef,
}) => {
  // Mode selection: 'ai' | 'human'
  const [activeChannel, setActiveChannel] = useState<'ai' | 'human'>('ai');

  // Nexa AI Chat State
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: 'Olá! Sou a assistente virtual da Nexa Host. Como posso ajudar você hoje?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const aiChatEndRef = useRef<HTMLDivElement | null>(null);

  // Human SAC State
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // New ticket form
  const [ticketName, setTicketName] = useState('');
  const [ticketPhone, setTicketPhone] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketSubject, setTicketSubject] = useState(
    initialOrderRef ? `Dúvida sobre o Pedido ${initialOrderRef}` : ''
  );
  const [ticketCategory, setTicketCategory] = useState<TicketCategory>('Técnico');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');

  // Human chat response inside selected ticket
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    setTickets(storageService.getTickets());
  }, []);

  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isAiTyping]);

  const handleSendAi = async (textToSend?: string) => {
    const messageText = textToSend || aiInput;
    if (!messageText.trim() || isAiTyping) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setAiInput('');
    setIsAiTyping(true);

    try {
      const reply = await aiService.sendMessage(messageText.trim());
      const botMsg: AIMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toISOString(),
      };
      setAiMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: AIMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: 'Atendimento automático temporariamente indisponível. Você pode falar com um atendente humano.',
        timestamp: new Date().toISOString(),
      };
      setAiMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName.trim() || !ticketPhone.trim() || !ticketSubject.trim() || !ticketMessage.trim()) {
      return;
    }

    const newTicket = storageService.createTicket({
      customerName: ticketName.trim(),
      customerPhone: ticketPhone.trim(),
      customerEmail: ticketEmail.trim() || undefined,
      subject: ticketSubject.trim(),
      category: ticketCategory,
      orderNumber: initialOrderRef,
      initialMessage: ticketMessage.trim(),
    });

    setTickets(storageService.getTickets());
    setSelectedTicketId(newTicket.id);
    setShowNewTicketModal(false);
    setTicketSuccess(`Chamado ${newTicket.id} aberto com sucesso! Nossa equipe entrará em contato.`);
    setTicketMessage('');
    setTimeout(() => setTicketSuccess(''), 6000);
  };

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !replyText.trim()) return;

    const updated = storageService.addTicketMessage(
      selectedTicketId,
      'cliente',
      'Cliente',
      replyText.trim()
    );

    if (updated) {
      setTickets(storageService.getTickets());
      setReplyText('');
    }
  };

  const quickPrompts = [
    'Quais são os planos?',
    'Como faço o pagamento?',
    'Como contrato?',
    'Quero saber sobre minha VPS',
    'Preciso de suporte',
  ];

  const currentSelectedTicket = tickets.find((t) => t.id === selectedTicketId);

  return (
    <section id="suporte" className="py-12 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title & Section Choice */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Headphones className="w-3.5 h-3.5 text-cyan-400" />
          <span>CENTRAL DE ATENDIMENTO NEXA HOST</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Como você prefere ser atendido?
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Escolha entre nossa IA com respostas imediatas 24/7 ou abra um chamado direto com nossos analistas no SAC e Discord.
        </p>

        {/* 2 Options Switcher */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveChannel('ai')}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl border text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-3 cursor-pointer ${
              activeChannel === 'ai'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-400 text-cyan-300 shadow-xl shadow-cyan-950/50 scale-[1.02]'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>⚡ ATENDIMENTO RÁPIDO — IA</span>
          </button>

          <button
            onClick={() => setActiveChannel('human')}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl border text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-3 cursor-pointer ${
              activeChannel === 'human'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-400 text-cyan-300 shadow-xl shadow-cyan-950/50 scale-[1.02]'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <User className="w-5 h-5 text-cyan-400" />
            <span>👨‍💻 ATENDIMENTO HUMANO</span>
          </button>
        </div>
      </div>

      {ticketSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{ticketSuccess}</span>
        </div>
      )}

      {/* OPTION 1: NEXA AI INTERFACE */}
      {activeChannel === 'ai' && (
        <div className="max-w-4xl mx-auto rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 overflow-hidden flex flex-col h-[580px]">
          {/* AI Header */}
          <div className="px-6 py-4 bg-slate-900/90 border-b border-cyan-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">Nexa AI</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Online 24/7
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Assistente virtual especializada em infraestrutura, Xeon, NVMe e PIX
                </p>
              </div>
            </div>

            {settings.socials.discordActive && (
              <a
                href={settings.socials.discord}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <span>Discord Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-900 flex items-center gap-2 overflow-x-auto text-xs font-medium">
            <span className="text-slate-500 text-[11px] font-mono shrink-0">Sugestões:</span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendAi(prompt)}
                className="px-3 py-1 rounded-full bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all shrink-0 cursor-pointer text-xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isAiTyping && (
              <div className="flex gap-3 items-center text-slate-400 text-xs">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <span className="font-mono">Nexa AI está digitando...</span>
              </div>
            )}
            <div ref={aiChatEndRef} />
          </div>

          {/* AI Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendAi();
            }}
            className="p-4 bg-slate-900/80 border-t border-slate-800/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Digite sua dúvida sobre planos, ativação, PIX, Xeon..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 font-sans"
            />
            <button
              type="submit"
              disabled={isAiTyping || !aiInput.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* OPTION 2: HUMAN SAC & CHANNELS */}
      {activeChannel === 'human' && (
        <div className="max-w-5xl mx-auto rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 overflow-hidden flex flex-col md:flex-row h-[620px]">
          {/* Left Sidebar: Tickets / Channels List */}
          <div className="w-full md:w-80 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider block">
                  SAC // CANAIS
                </span>
                <h4 className="text-sm font-bold text-white">Seus Chamados</h4>
              </div>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>+ Novo</span>
              </button>
            </div>

            {/* Channels list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {tickets.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  Nenhum atendimento aberto ainda. Clique em "+ Novo" para falar com um atendente humano.
                </div>
              ) : (
                tickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all border text-xs cursor-pointer ${
                      selectedTicketId === t.id
                        ? 'bg-cyan-950/50 border-cyan-500/50 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-cyan-400">{t.id}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {t.status}
                      </span>
                    </div>
                    <p className="font-medium text-slate-200 truncate">{t.subject}</p>
                    <p className="text-[11px] text-slate-500 truncate">{t.customerName}</p>
                  </button>
                ))
              )}
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 text-center">
              Plantão Técnico 24h &bull; Tempo médio de resposta: ~20 min
            </div>
          </div>

          {/* Right Area: Ticket Chat or Create View */}
          <div className="flex-1 flex flex-col bg-slate-950">
            {currentSelectedTicket ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400">
                        {currentSelectedTicket.id}
                      </span>
                      <span className="text-white font-bold text-sm">
                        {currentSelectedTicket.subject}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span>Cliente: {currentSelectedTicket.customerName}</span>
                      {currentSelectedTicket.orderNumber && (
                        <span>Ref: {currentSelectedTicket.orderNumber}</span>
                      )}
                      <span className="text-cyan-300 font-mono">[{currentSelectedTicket.category}]</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono">
                      Status: {currentSelectedTicket.status}
                    </span>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {currentSelectedTicket.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        m.author === 'cliente' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1 px-1 font-mono">
                        <span className="font-semibold text-slate-400">{m.authorName}</span>
                        <span>
                          {new Date(m.timestamp).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div
                        className={`max-w-lg p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                          m.author === 'cliente'
                            ? 'bg-cyan-600 text-white rounded-tr-none'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form
                  onSubmit={handleSendTicketReply}
                  className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Digite sua resposta para o atendente da Nexa Host..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    Enviar
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Headphones className="w-7 h-7" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="text-lg font-bold text-white">Atendimento Direto com Especialistas</h4>
                  <p className="text-xs text-slate-400">
                    Seu atendimento será direcionado para nossa equipe técnica. Abra um chamado ao lado ou escolha um atendimento existente.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewTicketModal(true)}
                  className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all cursor-pointer"
                >
                  ABRIR NOVO ATENDIMENTO
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal for Creating New Ticket */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-950 rounded-2xl border border-cyan-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  NOVO CHAMADO // SAC
                </span>
                <h3 className="text-lg font-bold text-white">Falar com Atendente Humano</h3>
              </div>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Seu atendimento será direcionado para nossa equipe técnica.
            </p>

            <form onSubmit={handleCreateTicket} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketPhone}
                    onChange={(e) => setTicketPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as TicketCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Financeiro">Financeiro / PIX</option>
                    <option value="Técnico">Técnico / VPS</option>
                    <option value="Vendas">Vendas / Dúvidas</option>
                    <option value="Dúvidas">Dúvidas Gerais</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Assunto *
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Ex: #1001 — Dúvida sobre ativação ou porta firewall"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Mensagem Detalhada *
                </label>
                <textarea
                  rows={3}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Descreva seu problema ou solicitação..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all cursor-pointer"
                >
                  ABRIR ATENDIMENTO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
