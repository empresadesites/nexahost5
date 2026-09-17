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
  Check,
  Copy,
  Sparkles,
  Key,
  Terminal,
  ExternalLink,
  RefreshCw,
  EyeOff,
  UserCheck,
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

  // Status edit state for general management
  const [editStatus, setEditStatus] = useState<OrderStatus>('novo');
  const [adminNotes, setAdminNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Dedicated Payment Approval Modal State
  const [approvingOrder, setApprovingOrder] = useState<Order | null>(null);
  const [approvalIp, setApprovalIp] = useState('');
  const [approvalVpsName, setApprovalVpsName] = useState('');
  const [approvalVpsUser, setApprovalVpsUser] = useState('root');
  const [approvalVpsPassword, setApprovalVpsPassword] = useState('');
  const [approvalVpsPort, setApprovalVpsPort] = useState('22');
  const [approvalApprover, setApprovalApprover] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [approvalError, setApprovalError] = useState('');
  const [showApprovalPassword, setShowApprovalPassword] = useState(false);

  // Post-approval success & send screen state
  const [approvedSuccessOrder, setApprovedSuccessOrder] = useState<Order | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Helpers
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let pass = '';
    for (let i = 0; i < 14; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const copyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const currentAdminSession = storageService.getAdminSession();

  const handleStartApproval = (order: Order) => {
    const isWindows = order.osChoice?.toLowerCase().includes('windows');
    const defaultUser = isWindows ? 'Administrator' : 'root';
    const defaultPort = isWindows ? '3389' : '22';
    const defaultName = order.vpsName || `vps-${order.customerName.trim().split(' ')[0].toLowerCase()}-01`;
    const defaultApprover = currentAdminSession?.name || currentAdminSession?.roleTitle || 'Administrador Dono';

    setApprovingOrder(order);
    setApprovalIp(order.vpsIp && order.vpsIp !== 'A definir pela Nexa' ? order.vpsIp : '');
    setApprovalVpsName(defaultName);
    setApprovalVpsUser(order.vpsUser || defaultUser);
    setApprovalVpsPort(order.vpsPort || defaultPort);
    setApprovalVpsPassword(order.vpsPassword || generateRandomPassword());
    setApprovalApprover(defaultApprover);
    setApprovalNotes(order.adminNotes || 'Servidor ativado e testado no rack. Acesso liberado.');
    setApprovalError('');
    setShowApprovalPassword(false);
    setApprovedSuccessOrder(null);
  };

  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingOrder) return;

    if (!approvalIp.trim()) {
      setApprovalError('Por favor, informe o IP da VPS a ser liberada.');
      return;
    }
    if (!approvalVpsName.trim()) {
      setApprovalError('Por favor, informe o nome/hostname do servidor.');
      return;
    }
    if (!approvalVpsPassword.trim()) {
      setApprovalError('Por favor, informe a senha de acesso root/admin.');
      return;
    }

    const updated = storageService.approveOrderAndActivateVps(approvingOrder.id, {
      vpsIp: approvalIp.trim(),
      vpsName: approvalVpsName.trim(),
      vpsUser: approvalVpsUser.trim() || 'root',
      vpsPassword: approvalVpsPassword.trim(),
      vpsPort: approvalVpsPort.trim() || '22',
      approvedBy: approvalApprover.trim() || 'Administrador',
      adminNotes: approvalNotes.trim(),
    });

    if (updated) {
      setApprovedSuccessOrder(updated);
      onRefresh();
      // If currently viewing in selectedOrder, update it too
      if (selectedOrder && selectedOrder.id === updated.id) {
        setSelectedOrder(updated);
      }
    }
  };

  const buildWhatsAppMessage = (order: Order) => {
    const isWindows = order.vpsPort === '3389' || order.osChoice?.toLowerCase().includes('windows');
    return `🚀 *NEXA HOST - SEU SERVIDOR VPS ESTÁ ATIVO!* 🚀

Olá *${order.customerName}*, confirmamos o seu pagamento referente ao pedido *${order.id}*.
A sua máquina já foi provisionada no nosso datacenter e está pronta para uso!

⚙️ *DETALHES DO PLANO:*
• *Plano:* ${order.planName} (${order.ram} RAM / ${order.cpu} CPU / ${order.ssd} SSD)
• *Sistema:* ${order.osChoice || 'Linux / Windows'}

🔑 *DADOS DE ACESSO DO SERVIDOR:*
• *IP da VPS:* ${order.vpsIp}
• *Nome do Servidor:* ${order.vpsName || 'vps-server'}
• *Usuário:* ${order.vpsUser || 'root'}
• *Senha de Acesso:* ${order.vpsPassword}
• *Porta:* ${order.vpsPort || (isWindows ? '3389' : '22')}

📋 *COMO SE CONECTAR:*
${
  isWindows
    ? `Abra a "Conexão de Área de Trabalho Remota" (mstsc) do seu computador e insira:\nComputador: ${order.vpsIp}:${order.vpsPort || '3389'}\nUsuário: ${order.vpsUser || 'Administrator'}\nSenha: ${order.vpsPassword}`
    : `Abra seu terminal ou cliente PuTTY e digite:\nssh ${order.vpsUser || 'root'}@${order.vpsIp} -p ${order.vpsPort || '22'}\nInsira a senha acima quando solicitada.`
}

🌐 *Rastreamento:*
Acompanhe seu serviço a qualquer momento no nosso site informando o código ${order.id}.

Qualquer dúvida, responda diretamente a esta mensagem!
*Equipe Nexa Host*`;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'todos' || order.status === filterStatus;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      (order.vpsIp && order.vpsIp.includes(searchTerm));
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
            Aprove pagamentos PIX, aloque o IP, usuário e senha da VPS e envie diretamente ao cliente.
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
              placeholder="Buscar por código, cliente, IP..."
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
              <option value="ativo" className="bg-slate-900">Ativo (VPS Liberada)</option>
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
                <th className="px-4 py-3.5">Pedido</th>
                <th className="px-4 py-3.5">Cliente</th>
                <th className="px-4 py-3.5">Plano / Specs</th>
                <th className="px-4 py-3.5">IP da VPS</th>
                <th className="px-4 py-3.5">Valor</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Data</th>
                <th className="px-4 py-3.5 text-right">Ações de Aprovação</th>
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
                    <td className="px-4 py-3.5 font-mono font-bold text-cyan-300">
                      {order.id}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">{order.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-200">{order.planName}</div>
                      <div className="text-[10px] text-slate-500">
                        {order.ram} &bull; {order.cpu}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {order.vpsIp ? (
                        <span className="font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                          {order.vpsIp}
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-400/80 italic">
                          Aguardando aprovação
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-white">
                      R$ {order.price.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status !== 'ativo' ? (
                          <button
                            onClick={() => handleStartApproval(order)}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1 shadow-md shadow-emerald-900/30"
                            title="Aprovar Pagamento e Inserir IP/Senha da VPS"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Aprovar Pagamento</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartApproval(order)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Ver/Editar Credenciais de Acesso e Reenviar"
                          >
                            <Key className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Dados Acesso</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenOrder(order)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Visualizar Detalhes do Pedido"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detalhes</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL / CAIXA DE APROVAÇÃO DE PAGAMENTO E ENVIO DE ACESSO */}
      {/* ========================================================= */}
      {approvingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-950 rounded-2xl border-2 border-cyan-500/40 p-6 sm:p-7 shadow-2xl shadow-cyan-950/60 space-y-5 my-8">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-t-2xl"></div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider block">
                  PAINEL ADMINISTRATIVO // APROVAÇÃO MANUAL
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-emerald-400" />
                  <span>Aprovar Pagamento & Liberar VPS</span>
                </h3>
              </div>
              <button
                onClick={() => {
                  setApprovingOrder(null);
                  setApprovedSuccessOrder(null);
                }}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-850"
              >
                ✕
              </button>
            </div>

            {/* Order & Client Summary Strip */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Pedido:</span>
                <strong className="text-cyan-300 font-mono text-sm">{approvingOrder.id}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Cliente:</span>
                <strong className="text-white truncate block">{approvingOrder.customerName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">WhatsApp:</span>
                <span className="text-slate-300 font-mono">{approvingOrder.customerPhone}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Plano & Valor:</span>
                <strong className="text-emerald-400 font-mono">
                  {approvingOrder.planName} (R$ {approvingOrder.price.toFixed(2).replace('.', ',')})
                </strong>
              </div>
            </div>

            {/* If not yet confirmed, show the input form */}
            {!approvedSuccessOrder ? (
              <form onSubmit={handleConfirmApproval} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
                  <Key className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cyan-300 block font-mono text-[11px] uppercase">
                      Defina os dados de acesso da máquina que o cliente irá receber
                    </strong>
                    <p className="text-slate-300 text-[11px] mt-0.5">
                      Ao clicar em aprovar, o pagamento será validado, o status passará para <strong>Ativo</strong> e será gerada a mensagem completa pronta para enviar no WhatsApp do cliente.
                    </p>
                  </div>
                </div>

                {approvalError && (
                  <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{approvalError}</span>
                  </div>
                )}

                {/* Form Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* IP Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Endereço IP da VPS (Dedicado) *
                    </label>
                    <input
                      type="text"
                      required
                      value={approvalIp}
                      onChange={(e) => setApprovalIp(e.target.value)}
                      placeholder="Ex: 189.124.50.45"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-emerald-400 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-300 font-bold"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                      Informe o IP público designado ao cliente.
                    </span>
                  </div>

                  {/* Machine Name / Hostname */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Nome / Hostname da Máquina *
                    </label>
                    <input
                      type="text"
                      required
                      value={approvalVpsName}
                      onChange={(e) => setApprovalVpsName(e.target.value)}
                      placeholder="Ex: vps-carlos-01"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Identificador da máquina no cluster.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* VPS User */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Usuário de Acesso *
                    </label>
                    <input
                      type="text"
                      required
                      value={approvalVpsUser}
                      onChange={(e) => setApprovalVpsUser(e.target.value)}
                      placeholder="root ou Administrator"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <div className="flex gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setApprovalVpsUser('root')}
                        className="text-[10px] text-cyan-400 hover:underline"
                      >
                        root
                      </button>
                      <button
                        type="button"
                        onClick={() => setApprovalVpsUser('Administrator')}
                        className="text-[10px] text-cyan-400 hover:underline"
                      >
                        Administrator
                      </button>
                    </div>
                  </div>

                  {/* Port */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Porta de Conexão *
                    </label>
                    <input
                      type="text"
                      required
                      value={approvalVpsPort}
                      onChange={(e) => setApprovalVpsPort(e.target.value)}
                      placeholder="22 ou 3389"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <div className="flex gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setApprovalVpsPort('22')}
                        className="text-[10px] text-cyan-400 hover:underline"
                      >
                        22 (SSH)
                      </button>
                      <button
                        type="button"
                        onClick={() => setApprovalVpsPort('3389')}
                        className="text-[10px] text-cyan-400 hover:underline"
                      >
                        3389 (RDP)
                      </button>
                    </div>
                  </div>

                  {/* Approver Identification */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Aprovado por *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={approvalApprover}
                        onChange={(e) => setApprovalApprover(e.target.value)}
                        placeholder="Nome do Administrador"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Operador responsável pela aprovação.
                    </span>
                  </div>
                </div>

                {/* Password Input with Generator */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-200">
                      Senha de Acesso Root / Administrador da VPS *
                    </label>
                    <button
                      type="button"
                      onClick={() => setApprovalVpsPassword(generateRandomPassword())}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Gerar Senha Forte Aleatória</span>
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showApprovalPassword ? 'text' : 'password'}
                      required
                      value={approvalVpsPassword}
                      onChange={(e) => setApprovalVpsPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-400 pr-20 font-bold"
                    />
                    <div className="absolute right-2 top-2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowApprovalPassword(!showApprovalPassword)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                        title={showApprovalPassword ? 'Ocultar' : 'Visualizar'}
                      >
                        {showApprovalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyText(approvalVpsPassword, 'temp_pass')}
                        className="p-1.5 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors"
                        title="Copiar Senha"
                      >
                        {copiedType === 'temp_pass' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Admin notes / message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Instruções ou Observações Adicionais (Visível no Rastreio e WhatsApp)
                  </label>
                  <textarea
                    rows={2}
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    placeholder="Ex: VPS provisionada no cluster SP-01 com Ubuntu 22.04 LTS. Link de 1 Gbps ativo."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setApprovingOrder(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-slate-950 hover:from-emerald-300 hover:to-cyan-300 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>CONFIRMAR APROVAÇÃO E LIBERAR VPS</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Success / WhatsApp Sender View */
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-1">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Pagamento Aprovado e VPS Ativada com Sucesso!
                  </h4>
                  <p className="text-xs text-emerald-300">
                    O pedido <strong>{approvedSuccessOrder.id}</strong> agora está com status <strong>ATIVO</strong> e os dados já estão disponíveis na consulta do cliente.
                  </p>
                </div>

                {/* Quick Access Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">IP DA VPS:</span>
                    <strong className="text-emerald-400 font-mono text-sm select-all">
                      {approvedSuccessOrder.vpsIp}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">USUÁRIO:</span>
                    <strong className="text-cyan-300 font-mono">{approvedSuccessOrder.vpsUser || 'root'}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">SENHA:</span>
                    <strong className="text-amber-300 font-mono select-all">
                      {approvedSuccessOrder.vpsPassword}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">PORTA:</span>
                    <strong className="text-white font-mono">{approvedSuccessOrder.vpsPort || '22'}</strong>
                  </div>
                </div>

                {/* WhatsApp Message Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Mensagem Pronta para Envio ao Cliente:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => copyText(buildWhatsAppMessage(approvedSuccessOrder), 'full_msg')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {copiedType === 'full_msg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedType === 'full_msg' ? 'Copiado!' : 'Copiar Texto'}</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                    {buildWhatsAppMessage(approvedSuccessOrder)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setApprovingOrder(null);
                      setApprovedSuccessOrder(null);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Concluir e Fechar Caixa
                  </button>

                  <div className="w-full sm:w-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const credentials = `IP: ${approvedSuccessOrder.vpsIp}\nUsuário: ${approvedSuccessOrder.vpsUser || 'root'}\nSenha: ${approvedSuccessOrder.vpsPassword}\nPorta: ${approvedSuccessOrder.vpsPort || '22'}`;
                        copyText(credentials, 'creds');
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedType === 'creds' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedType === 'creds' ? 'Copiado!' : 'Copiar IP & Senha'}</span>
                    </button>

                    <a
                      href={`https://wa.me/${approvedSuccessOrder.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        buildWhatsAppMessage(approvedSuccessOrder)
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Enviar no WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DETALHADO DO PEDIDO // GERENCIAMENTO GERAL          */}
      {/* ========================================================= */}
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

            {/* If Order is NOT yet active: Highlight approval action button */}
            {selectedOrder.status !== 'ativo' && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 via-cyan-950/40 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-1 text-xs">
                  <strong className="text-emerald-300 font-bold block text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Pagamento Pendente de Aprovação</span>
                  </strong>
                  <p className="text-slate-300 text-[11px]">
                    Abra a caixa de aprovação para designar o IP da VPS, gerar a senha e disparar os acessos para o cliente.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const orderToApprove = selectedOrder;
                    setSelectedOrder(null);
                    handleStartApproval(orderToApprove);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Aprovar & Ativar Agora</span>
                </button>
              </div>
            )}

            {/* If Order IS active: Show full credentials box */}
            {selectedOrder.status === 'ativo' && selectedOrder.vpsIp && (
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>DADOS DE ACESSO DA VPS LIBERADOS</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const orderToEdit = selectedOrder;
                      setSelectedOrder(null);
                      handleStartApproval(orderToEdit);
                    }}
                    className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Editar Dados / Reenviar</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">IP VPS:</span>
                    <strong className="text-emerald-400 font-mono text-sm">{selectedOrder.vpsIp}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Usuário:</span>
                    <strong className="text-cyan-300 font-mono">{selectedOrder.vpsUser || 'root'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Senha:</span>
                    <strong className="text-amber-300 font-mono">{selectedOrder.vpsPassword || '••••••••'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Porta:</span>
                    <strong className="text-white font-mono">{selectedOrder.vpsPort || '22'}</strong>
                  </div>
                </div>

                {selectedOrder.approvedBy && (
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 flex items-center justify-between">
                    <span>Aprovado por: <strong className="text-slate-200">{selectedOrder.approvedBy}</strong></span>
                    {selectedOrder.approvedAt && (
                      <span>Data: {new Date(selectedOrder.approvedAt).toLocaleString('pt-BR')}</span>
                    )}
                  </div>
                )}
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
                        buildWhatsAppMessage(selectedOrder)
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <Phone className="w-3 h-3" />
                      <span>WhatsApp</span>
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
                  <span className="text-slate-500 block">Sistema Operacional:</span>
                  <span className="text-slate-200 font-mono">
                    {selectedOrder.osChoice || 'Padrão Linux'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Nome da VPS:</span>
                  <span className="text-cyan-300 font-mono font-bold">
                    {selectedOrder.vpsName || 'vps-server'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">IP Designado:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {selectedOrder.vpsIp || 'Pendente de aprovação'}
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
                  placeholder="Ex: VPS provisionada no cluster SP-01 com Ubuntu 22.04 LTS. IP ativo."
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
