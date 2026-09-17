import React from 'react';
import {
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  Headphones,
  DollarSign,
  Server,
  Zap,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { Order, Plan, Ticket } from '../../types';

interface AdminDashboardProps {
  orders: Order[];
  plans: Plan[];
  tickets: Ticket[];
  onNavigate: (module: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  plans,
  tickets,
  onNavigate,
}) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) =>
      o.status === 'aguardando_pagamento' ||
      o.status === 'pagamento_informado' ||
      o.status === 'em_analise'
  ).length;
  const paidOrders = orders.filter(
    (o) => o.status === 'pago' || o.status === 'ativacao_pendente'
  ).length;
  const activeOrders = orders.filter((o) => o.status === 'ativo').length;
  const openTickets = tickets.filter(
    (t) => t.status === 'aberto' || t.status === 'em_atendimento'
  ).length;

  const estimatedMonthlyRevenue = orders
    .filter((o) => o.status === 'ativo' || o.status === 'pago')
    .reduce((acc, o) => acc + o.price, 0);

  const activePlansCount = plans.filter((p) => p.active).length;

  return (
    <div className="space-y-8">
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Painel Geral Nexa Host</h2>
          <p className="text-xs text-slate-400">
            Visão consolidada de pedidos de VPS, confirmações de PIX e atendimentos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-500/30">
            Fila de Ativação Manual: <strong>{pendingOrders + paidOrders}</strong>
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pedidos */}
        <div
          onClick={() => onNavigate('orders')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">TOTAL DE PEDIDOS</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{totalOrders}</div>
          <span className="text-[11px] text-cyan-400 block font-mono">
            {activeOrders} VPS ativas atualmente
          </span>
        </div>

        {/* Pedidos Pendentes de Conferência */}
        <div
          onClick={() => onNavigate('orders')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-yellow-500/40 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">PENDENTES // PIX</span>
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-yellow-300">{pendingOrders}</div>
          <span className="text-[11px] text-yellow-400/80 block font-mono">
            Aguardando validação ou envio
          </span>
        </div>

        {/* Receita Estimada */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">RECEITA ESTIMADA</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-300 font-mono">
            R$ {estimatedMonthlyRevenue.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[11px] text-slate-400 block">Base recorrente mensal</span>
        </div>

        {/* Tickets Abertos */}
        <div
          onClick={() => onNavigate('tickets')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">CHAMADOS NO SAC</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Headphones className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-300">{openTickets}</div>
          <span className="text-[11px] text-slate-400 block">
            {tickets.length} chamados registrados no total
          </span>
        </div>
      </div>

      {/* Visual Analytics and Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Distribuição de Status dos Pedidos
            </h3>
            <span className="text-xs text-slate-500 font-mono">Atualização em tempo real</span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-emerald-400">VPS Ativas ({activeOrders})</span>
                <span className="text-slate-400">
                  {totalOrders > 0 ? Math.round((activeOrders / totalOrders) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalOrders > 0 ? (activeOrders / totalOrders) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-yellow-400">Aguardando / Pagamento Informado ({pendingOrders})</span>
                <span className="text-slate-400">
                  {totalOrders > 0 ? Math.round((pendingOrders / totalOrders) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-cyan-400">Em Provisionamento Manual ({paidOrders})</span>
                <span className="text-slate-400">
                  {totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-4 grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Planos Ativos</span>
              <strong className="text-cyan-300 text-sm">{activePlansCount}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Taxa de Conversão</span>
              <strong className="text-emerald-300 text-sm">92%</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Método</span>
              <strong className="text-cyan-300 text-sm">PIX Manual</strong>
            </div>
          </div>
        </div>

        {/* Quick Operations Box */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-2">
              Ações Rápidas do Administrador
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Atalhos para as operações mais frequentes da equipe de suporte.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => onNavigate('orders')}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-left text-slate-200 transition-colors flex items-center justify-between"
              >
                <span>Conferir Fila de Pedidos</span>
                <Package className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                onClick={() => onNavigate('plans')}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-left text-slate-200 transition-colors flex items-center justify-between"
              >
                <span>Editar Preços / Novo Plano</span>
                <Zap className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                onClick={() => onNavigate('tickets')}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-left text-slate-200 transition-colors flex items-center justify-between"
              >
                <span>Responder Atendimentos SAC</span>
                <Headphones className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                onClick={() => onNavigate('settings')}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-left text-slate-200 transition-colors flex items-center justify-between"
              >
                <span>Alterar Discord / WhatsApp / Chave PIX</span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-300">
            💡 Dica: Toda alteração de status envia notificação no log de auditoria.
          </div>
        </div>
      </div>
    </div>
  );
};
