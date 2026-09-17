import React, { useState } from 'react';
import {
  Headphones,
  Send,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Hash,
  Phone,
  Filter,
} from 'lucide-react';
import { Ticket, TicketStatus } from '../../types';
import { storageService } from '../../services/storage';

interface AdminTicketsProps {
  tickets: Ticket[];
  onRefresh: () => void;
}

export const AdminTickets: React.FC<AdminTicketsProps> = ({
  tickets,
  onRefresh,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    tickets[0]?.id || null
  );
  const [replyText, setReplyText] = useState('');
  const [operatorName, setOperatorName] = useState('Suporte Nexa Host');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'todos') return true;
    return t.status === filterStatus;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    storageService.addTicketMessage(
      selectedTicket.id,
      'atendente',
      operatorName.trim() || 'Equipe Nexa',
      replyText.trim()
    );

    setReplyText('');
    onRefresh();
  };

  const handleUpdateStatus = (status: TicketStatus) => {
    if (!selectedTicket) return;
    storageService.updateTicketStatus(selectedTicket.id, status);
    onRefresh();
  };

  const handleAssignToMe = () => {
    if (!selectedTicket) return;
    storageService.updateTicketStatus(selectedTicket.id, 'em_atendimento', operatorName);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-cyan-400" />
            <span>SAC // Painel de Atendimento Humano</span>
          </h2>
          <p className="text-xs text-slate-400">
            Responda chamados, alterne status de atendimento e converse diretamente com os clientes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="todos" className="bg-slate-900">Todos os Status</option>
              <option value="aberto" className="bg-slate-900">Aberto</option>
              <option value="em_atendimento" className="bg-slate-900">Em Atendimento</option>
              <option value="aguardando_cliente" className="bg-slate-900">Aguardando Cliente</option>
              <option value="resolvido" className="bg-slate-900">Resolvido</option>
              <option value="fechado" className="bg-slate-900">Fechado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Support Grid */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl flex flex-col md:flex-row h-[600px]">
        {/* Left: Tickets List */}
        <div className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-950/70">
          <div className="p-3.5 border-b border-slate-800 text-xs font-mono text-slate-400 uppercase tracking-wider flex justify-between items-center">
            <span>Fila de Chamados ({filteredTickets.length})</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredTickets.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Nenhum chamado encontrado nesta categoria.
              </div>
            ) : (
              filteredTickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border text-xs cursor-pointer ${
                    selectedTicketId === t.id
                      ? 'bg-cyan-950/60 border-cyan-500/50 text-white'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-cyan-400">{t.id}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                        t.status === 'aberto'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          : t.status === 'em_atendimento'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="font-semibold text-white truncate">{t.subject}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{t.customerName}</span>
                    <span className="font-mono text-cyan-300/80">[{t.category}]</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Ticket Conversation & Actions */}
        <div className="flex-1 flex flex-col bg-slate-950">
          {selectedTicket ? (
            <>
              {/* Header & Status Actions */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      {selectedTicket.id}
                    </span>
                    <h3 className="font-bold text-white text-base">
                      {selectedTicket.subject}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5 font-mono">
                    <span>Cliente: {selectedTicket.customerName}</span>
                    <span>Tel: {selectedTicket.customerPhone}</span>
                    {selectedTicket.orderNumber && (
                      <span className="text-cyan-300">Pedido: {selectedTicket.orderNumber}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAssignToMe}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
                  >
                    Assumir Chamado
                  </button>

                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateStatus(e.target.value as TicketStatus)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-700 text-xs font-mono cursor-pointer"
                  >
                    <option value="aberto">Aberto</option>
                    <option value="em_atendimento">Em Atendimento</option>
                    <option value="aguardando_cliente">Aguardando Cliente</option>
                    <option value="resolvido">Resolvido</option>
                    <option value="fechado">Fechado</option>
                  </select>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {selectedTicket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.author === 'atendente' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1 px-1 font-mono">
                      <span
                        className={
                          m.author === 'atendente' ? 'text-cyan-400 font-bold' : 'text-slate-300'
                        }
                      >
                        {m.authorName} {m.author === 'atendente' ? '(Operador Nexa)' : ''}
                      </span>
                      <span>
                        {new Date(m.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div
                      className={`max-w-lg p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                        m.author === 'atendente'
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
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
                onSubmit={handleSendReply}
                className="p-4 border-t border-slate-800 bg-slate-900/70 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Digite sua resposta oficial de suporte para o cliente..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Responder</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500 text-xs">
              Selecione um chamado na lista ao lado para interagir com o cliente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
