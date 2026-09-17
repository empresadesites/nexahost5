import React, { useState, useEffect } from 'react';
import {
  Search,
  Server,
  Cpu,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertCircle,
  Headphones,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Zap,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Terminal,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { storageService } from '../services/storage';

interface OrderTrackingProps {
  initialOrderId?: string;
  onOpenSupportWithOrder: (orderId: string) => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  initialOrderId,
  onOpenSupportWithOrder,
}) => {
  const [searchCode, setSearchCode] = useState(initialOrderId || '');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [showVpsPassword, setShowVpsPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  useEffect(() => {
    const orders = storageService.getOrders();
    setRecentOrders(orders.slice(0, 4));

    if (initialOrderId) {
      const match = orders.find(
        (o) => o.id.toUpperCase() === initialOrderId.trim().toUpperCase()
      );
      if (match) {
        setCurrentOrder(match);
        setHasSearched(true);
      }
    }
  }, [initialOrderId]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchCode.trim()) return;

    const orders = storageService.getOrders();
    const formatted = searchCode.trim().toUpperCase();
    const match = orders.find(
      (o) => o.id.toUpperCase() === formatted || o.id.replace('NX-', '') === formatted
    );

    setCurrentOrder(match || null);
    setHasSearched(true);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'ativo':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            🟢 ATIVO // VPS ATIVADA
          </span>
        );
      case 'pagamento_informado':
      case 'em_analise':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            🔵 PAGAMENTO INFORMADO // EM ANÁLISE
          </span>
        );
      case 'pago':
      case 'ativacao_pendente':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            🟣 EM PROVISIONAMENTO MANUAL
          </span>
        );
      case 'cancelado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            🔴 CANCELADO
          </span>
        );
      case 'aguardando_pagamento':
      case 'novo':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            🟡 AGUARDANDO CONFIRMAÇÃO DO PAGAMENTO
          </span>
        );
    }
  };

  return (
    <section className="py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>PORTAL DE CONSULTA PÚBLICA</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Acompanhamento do Pedido
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Informe o código gerado durante o checkout (ex: <strong className="text-cyan-300">NX-894102</strong>) para verificar a confirmação do PIX e a ativação manual da sua VPS.
        </p>
      </div>

      {/* Search Input Bar */}
      <form
        onSubmit={handleSearch}
        className="max-w-xl mx-auto mb-10 flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-xl shadow-black/60 focus-within:border-cyan-400 transition-all"
      >
        <div className="pl-3 text-cyan-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          placeholder="Digite o código (ex: NX-894102)..."
          className="w-full bg-transparent px-2 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none uppercase"
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all cursor-pointer shrink-0"
        >
          Rastrear
        </button>
      </form>

      {/* Search Result */}
      {hasSearched && currentOrder && (
        <div className="rounded-2xl bg-slate-950 border border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-mono text-slate-400 block mb-1">
                PEDIDO NEXA HOST
              </span>
              <h3 className="text-2xl font-black font-mono text-cyan-300 tracking-wider">
                {currentOrder.id}
              </h3>
            </div>
            <div>{getStatusBadge(currentOrder.status)}</div>
          </div>

          {/* Timeline Visual Status Tracker */}
          <div className="py-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-4">
              Etapas do Processo de Ativação Manual
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div
                className={`p-3 rounded-xl border ${
                  ['aguardando_pagamento', 'pagamento_informado', 'em_analise', 'pago', 'ativacao_pendente', 'ativo'].includes(
                    currentOrder.status
                  )
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className="font-mono font-bold block mb-0.5">1. Pedido Criado</span>
                <span className="text-[11px] opacity-80">Registrado no sistema</span>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  ['pagamento_informado', 'em_analise', 'pago', 'ativacao_pendente', 'ativo'].includes(
                    currentOrder.status
                  )
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className="font-mono font-bold block mb-0.5">2. PIX Informado</span>
                <span className="text-[11px] opacity-80">Comprovante em conferência</span>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  ['pago', 'ativacao_pendente', 'ativo'].includes(currentOrder.status)
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className="font-mono font-bold block mb-0.5">3. Provisionando VPS</span>
                <span className="text-[11px] opacity-80">Configuração física no rack</span>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  currentOrder.status === 'ativo'
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className="font-mono font-bold block mb-0.5">4. VPS Liberada</span>
                <span className="text-[11px] opacity-80">Online e pronta para uso</span>
              </div>
            </div>
          </div>

          {/* VPS Credentials Box (When order is active and approved by admin) */}
          {currentOrder.status === 'ativo' && currentOrder.vpsIp && (
            <div className="rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-cyan-950/40 border-2 border-emerald-500/50 p-6 shadow-2xl shadow-emerald-950/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/30 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider block">
                      SERVIÇO PROVISIONADO // DADOS DE ACESSO
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white">
                      Credenciais de Conexão à sua VPS
                    </h4>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const fullDetails = `🚀 NEXA HOST - DADOS DE ACESSO VPS\nPedido: ${currentOrder.id}\nPlano: ${currentOrder.planName}\nIP da VPS: ${currentOrder.vpsIp}\nHostname: ${currentOrder.vpsName || 'vps-server'}\nUsuário: ${currentOrder.vpsUser || 'root'}\nSenha: ${currentOrder.vpsPassword || '[Definida pelo Administrador]'}\nPorta: ${currentOrder.vpsPort || '22'}\nComando SSH: ssh ${currentOrder.vpsUser || 'root'}@${currentOrder.vpsIp}`;
                    copyToClipboard(fullDetails, 'all');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  {copiedField === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'all' ? 'TUDO COPIADO!' : 'COPIAR TODAS CREDENCIAIS'}</span>
                </button>
              </div>

              {/* Credentials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {/* IP Field */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">IP da VPS:</span>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-emerald-300 font-black text-sm select-all">
                      {currentOrder.vpsIp}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentOrder.vpsIp || '', 'ip')}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="Copiar IP"
                    >
                      {copiedField === 'ip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Hostname Field */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">Hostname / Nome:</span>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-white font-bold text-xs truncate">
                      {currentOrder.vpsName || 'vps-server'}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentOrder.vpsName || '', 'name')}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="Copiar Nome"
                    >
                      {copiedField === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* User Field */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">Usuário:</span>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-cyan-300 font-bold text-xs">
                      {currentOrder.vpsUser || 'root'}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentOrder.vpsUser || 'root', 'user')}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="Copiar Usuário"
                    >
                      {copiedField === 'user' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Password Field */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">Senha Root / Admin:</span>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-amber-300 font-bold text-xs">
                      {currentOrder.vpsPassword
                        ? showVpsPassword
                          ? currentOrder.vpsPassword
                          : '••••••••••••'
                        : '[Definida pelo Administrador]'}
                    </span>
                    <div className="flex items-center gap-1">
                      {currentOrder.vpsPassword && (
                        <button
                          type="button"
                          onClick={() => setShowVpsPassword(!showVpsPassword)}
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                          title={showVpsPassword ? 'Ocultar Senha' : 'Ver Senha'}
                        >
                          {showVpsPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      {currentOrder.vpsPassword && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(currentOrder.vpsPassword || '', 'pass')}
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                          title="Copiar Senha"
                        >
                          {copiedField === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Command Strip */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-300 overflow-x-auto">
                  <span className="text-cyan-400 shrink-0 font-bold">Comando de Conexão:</span>
                  <code className="text-emerald-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-[11px]">
                    {(currentOrder.vpsPort === '3389' || currentOrder.osChoice?.toLowerCase().includes('windows'))
                      ? `mstsc /v:${currentOrder.vpsIp}:${currentOrder.vpsPort || '3389'}`
                      : `ssh ${currentOrder.vpsUser || 'root'}@${currentOrder.vpsIp} -p ${currentOrder.vpsPort || '22'}`}
                  </code>
                </div>
                {currentOrder.approvedBy && (
                  <span className="text-[11px] text-slate-500 shrink-0">
                    Aprovado por: <strong className="text-slate-300">{currentOrder.approvedBy}</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Pending Approval Notice (When order is NOT yet active) */}
          {currentOrder.status !== 'ativo' && currentOrder.status !== 'cancelado' && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-amber-300 font-mono uppercase tracking-wider block text-[11px]">
                  Pagamento em Análise pela Administração
                </strong>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Os administradores da Nexa Host estão conferindo a transferência PIX no painel de controle. Assim que o pagamento for aprovado, o <strong>IP dedicado da VPS, nome, usuário e senha</strong> serão liberados automaticamente aqui e também enviados diretamente no seu WhatsApp!
                </p>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            {/* Machine Specs */}
            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                Especificações do Servidor
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Plano:</span>
                  <span className="font-bold text-white">{currentOrder.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">RAM:</span>
                  <span className="font-mono text-cyan-300">{currentOrder.ram}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Processador:</span>
                  <span className="font-mono text-cyan-300">{currentOrder.cpu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Armazenamento:</span>
                  <span className="font-mono text-cyan-300">{currentOrder.ssd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nome da VPS:</span>
                  <span className="font-mono text-white font-bold">{currentOrder.vpsName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">IP Designado:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {currentOrder.vpsIp || 'Em alocação pela equipe'}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial & Operator Notes */}
            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                Dados do Contrato & Atendimento
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cliente:</span>
                  <span className="font-medium text-white">{currentOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">WhatsApp:</span>
                  <span className="font-mono text-slate-200">{currentOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Valor Mensal:</span>
                  <span className="font-mono font-bold text-cyan-300">
                    R$ {currentOrder.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Método de Pagamento:</span>
                  <span className="font-mono text-slate-200">PIX Manual Instantâneo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Criado em:</span>
                  <span className="text-slate-300">
                    {new Date(currentOrder.createdAt).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(currentOrder.createdAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Admin Note if present */}
              {currentOrder.adminNotes && (
                <div className="mt-3 p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200">
                  <span className="font-semibold block text-[11px] uppercase tracking-wider text-cyan-400 mb-1">
                    Nota do Operador Nexa Host:
                  </span>
                  <p>{currentOrder.adminNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Dúvidas sobre a ativação? Nossa equipe está de plantão no SAC e Discord.
            </span>
            <button
              onClick={() => onOpenSupportWithOrder(currentOrder.id)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Headphones className="w-4 h-4" />
              <span>Abrir Chamado para Este Pedido</span>
            </button>
          </div>
        </div>
      )}

      {hasSearched && !currentOrder && (
        <div className="p-8 rounded-2xl bg-slate-950 border border-red-500/30 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Pedido não encontrado</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Não encontramos nenhum pedido registrado com o código informado ({searchCode}). Verifique se digitou corretamente o prefixo <strong>NX-</strong>.
          </p>
        </div>
      )}

      {/* Suggested Quick Lookups */}
      {!hasSearched && recentOrders.length > 0 && (
        <div className="mt-8 p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-3">
            Pedidos Recentes Ativos na Plataforma (Exemplos de Consulta):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => {
                  setSearchCode(order.id);
                  setCurrentOrder(order);
                  setHasSearched(true);
                }}
                className="text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all text-xs space-y-1 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-cyan-300">{order.id}</span>
                  <span className="text-[10px] text-slate-400">{order.planName}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">{order.customerName}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
