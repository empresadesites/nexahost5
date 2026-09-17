import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { InfrastructureItem, ServiceHealthStatus } from '../types';
import { storageService } from '../services/storage';

export const InfrastructureStatus: React.FC = () => {
  const [items, setItems] = useState<InfrastructureItem[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState('Agora');

  const loadData = () => {
    setItems(storageService.getInfrastructure());
    setLastRefreshed(new Date().toLocaleTimeString('pt-BR'));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Polling local
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: ServiceHealthStatus) => {
    switch (status) {
      case 'operacional':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            ● Operacional
          </span>
        );
      case 'manutencao':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            ● Manutenção
          </span>
        );
      case 'instabilidade':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>
            ● Instabilidade
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            ● Offline
          </span>
        );
    }
  };

  const allOperational = items.every((i) => i.status === 'operacional');

  return (
    <section id="status" className="py-12 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>STATUS EM TEMPO REAL</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          INFRAESTRUTURA NEXA
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Monitoramento contínuo de latência, nós de processamento Xeon, mitigação Anycast e conectividade dos nossos datacenters.
        </p>
      </div>

      {/* Global Status Banner */}
      <div
        className={`p-6 rounded-2xl border mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${
          allOperational
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            : 'bg-yellow-950/30 border-yellow-500/40 text-yellow-200'
        }`}
      >
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {allOperational
                ? 'Todos os Sistemas Operacionais'
                : 'Alguns Serviços em Manutenção ou Instabilidade'}
            </h3>
            <p className="text-xs text-slate-300">
              Nossos clusters estão recebendo e processando tráfego normalmente.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">Atualizado: {lastRefreshed}</span>
          <button
            onClick={loadData}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:text-cyan-300 text-slate-400 transition-colors"
            title="Atualizar status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Infrastructure Items Table/Cards */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl glass-card border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/40 transition-all"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                {item.type === 'Servidores' && <Server className="w-5 h-5" />}
                {item.type === 'Rede' && <Wifi className="w-5 h-5" />}
                {item.type === 'Painel' && <Terminal className="w-5 h-5" />}
                {item.type === 'API' && <Activity className="w-5 h-5" />}
                {item.type === 'DNS' && <ShieldCheck className="w-5 h-5" />}
                {item.type === 'Suporte' && <Activity className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm sm:text-base">{item.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {item.location}
                  </span>
                </div>
                {item.details && (
                  <p className="text-xs text-slate-400 mt-0.5">{item.details}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-6 text-xs font-mono">
              <div className="text-right">
                <span className="text-slate-500 text-[11px] block">Disponibilidade:</span>
                <span className="font-bold text-cyan-300">{item.uptime}</span>
              </div>

              <div className="text-right">
                <span className="text-slate-500 text-[11px] block">Ping Médio:</span>
                <span className="font-bold text-white">{item.latencyMs} ms</span>
              </div>

              <div>{getStatusBadge(item.status)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Network SLA Badge */}
      <div className="mt-10 p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
          GARANTIA DE SLA NEXA HOST
        </span>
        <p className="text-xs text-slate-300">
          Oferecemos 99.9% de disponibilidade em nossos nós de processamento Xeon em São Paulo e Virgínia, com redundância de energia, no-breaks e link com operadoras Tier 1.
        </p>
      </div>
    </section>
  );
};
