import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Phone,
  Mail,
  Server,
  Lock,
  MessageSquare,
  Shield,
  Edit3,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { storageService } from '../../services/storage';

interface AdminOrdersProps {
  orders: Order[];
  onRefresh: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onRefresh,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status edit state
  const [editStatus, setEditStatus] = useState<OrderStatus>('novo');
  const [adminNotes, setAdminNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'todos' || order.status === filterStatus;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setAdminNotes(order.adminNotes || '');
    setSaveSuccess(false);
  };

  const handleSaveOrderStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const updated = storageService.updateOrderStatus(
      selectedOrder.id,
      editStatus,
      adminNotes.trim()
    );

    if (updated) {
      setSelectedOrder(updated);
      setSaveSuccess(true);
      onRefresh();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'ativo':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      case 'pago':
      case 'ativacao_pendente':
        return 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40';
      case 'pagamento_informado':
      case 'em_analise':
        return 'bg-blue-950/60 text-blue-300 border-blue-500/40';
      case 'cancelado':
        return 'bg-red-950/60 text-red-300 border-red-500/40';
      default:
        return 'bg-yellow-950/60 text-yellow-300 border-yellow-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            <span>Gerenciamento de Pedidos e Ativações VPS</span>
          </h2>
          <p className="text-xs text-slate-400">
            Confirme comprovantes PIX, altere status e insira notas de provisionamento manual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, cliente..."
              className="pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="todos" className="bg-slate-900">Todos os Status</option>
              <option value="aguardando_pagamento" className="bg-slate-900">Aguardando Pagamento</option>
              <option value="pagamento_informado" className="bg-slate-900">Pagamento Informado</option>
              <option value="em_analise" className="bg-slate-900">Em Análise</option>
              <option value="pago" className="bg-slate-900">Pago</option>
              <option value="ativacao_pendente" className="bg-slate-900">Ativação Pendente</option>
              <option value="ativo" className="bg-slate-900">Ativo (Liberado)</option>
              <option value="cancelado" className="bg-slate-900">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Pedido</th>
                <th className="px-5 py-3.5">Cliente</th>
                <th className="px-5 py-3.5">Plano / Specs</th>
                <th className="px-5 py-3.5">Valor</th>
                <th className="px-5 py-3.5">Método</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Data</th>
                <th className="px-5 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                    Nenhum pedido localizado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-cyan-300">
                      {order.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-200">{order.planName}</div>
                      <div className="text-[10px] text-slate-500">
                        {order.ram} &bull; {order.cpu}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-white">
                      R$ {order.price.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-cyan-400">
                      {order.paymentMethod}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleOpenOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Gerenciar</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Order Detailed Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-950 rounded-2xl border border-cyan-500/40 p-6 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  VISUALIZAÇÃO DO PEDIDO // OPERADOR
                </span>
                <h3 className="text-2xl font-black font-mono text-white">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-2"
              >
                ✕
              </button>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Status do pedido e notas atualizadas com sucesso!</span>
              </div>
            )}

            {/* Client & Machine Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold block">
                  Informações do Contratante
                </span>
                <div>
                  <span className="text-slate-500 block">Nome:</span>
                  <strong className="text-white text-sm">{selectedOrder.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">WhatsApp:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200 font-mono">{selectedOrder.customerPhone}</span>
                    <a
                      href={`https://wa.me/${selectedOrder.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Olá ${selectedOrder.customerName}, aqui é da equipe Nexa Host sobre seu pedido ${selectedOrder.id}!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Conversar</span>
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block">E-mail:</span>
                  <span className="text-slate-300">{selectedOrder.customerEmail}</span>
                </div>
                {selectedOrder.customerDiscord && (
                  <div>
                    <span className="text-slate-500 block">Discord:</span>
                    <span className="text-indigo-300 font-mono">
                      {selectedOrder.customerDiscord}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold block">
                  Configuração da VPS
                </span>
                <div>
                  <span className="text-slate-500 block">Plano Contratado:</span>
                  <strong className="text-white">{selectedOrder.planName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Recursos:</span>
                  <span className="text-slate-300 font-mono">
                    {selectedOrder.ram} | {selectedOrder.cpu} | {selectedOrder.ssd}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Nome da VPS:</span>
                  <span className="text-cyan-300 font-mono font-bold">
                    {selectedOrder.vpsName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">IP Designado:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {selectedOrder.vpsIp || 'Pendente de alocação'}
                  </span>
                </div>
                {/* Security notice regarding password */}
                <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>
                    Senha VPS: {selectedOrder.vpsPasswordProvided ? 'Definida pelo cliente (protegida)' : 'Padrão da imagem'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleSaveOrderStatus} className="space-y-4 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Alterar Status do Pedido
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="novo">Novo</option>
                    <option value="aguardando_pagamento">Aguardando Pagamento</option>
                    <option value="pagamento_informado">Pagamento Informado</option>
                    <option value="em_analise">Em Análise</option>
                    <option value="pago">Pago</option>
                    <option value="ativacao_pendente">Ativação Pendente</option>
                    <option value="ativo">Ativo (VPS Liberada)</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Método de Pagamento
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="PIX Manual Instantâneo"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Notas de Provisionamento do Operador (Visível para o cliente no rastreio)
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Ex: VPS provisionada no cluster SP-01 com Ubuntu 22.04 LTS. IP 189.124.50.44 ativo."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Deseja realmente excluir permanentemente o pedido ${selectedOrder.id}?`)) {
                      storageService.deleteOrder(selectedOrder.id);
                      setSelectedOrder(null);
                      onRefresh();
                    }
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 transition-colors cursor-pointer"
                >
                  Excluir Pedido
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all cursor-pointer"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
