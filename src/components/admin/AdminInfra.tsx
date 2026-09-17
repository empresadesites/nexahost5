import React, { useState } from 'react';
import {
  Activity,
  Server,
  Wifi,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
} from 'lucide-react';
import { InfrastructureItem, ServiceHealthStatus } from '../../types';
import { storageService } from '../../services/storage';

interface AdminInfraProps {
  items: InfrastructureItem[];
  onRefresh: () => void;
}

export const AdminInfra: React.FC<AdminInfraProps> = ({
  items,
  onRefresh,
}) => {
  const [infraItems, setInfraItems] = useState<InfrastructureItem[]>(items);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleStatusChange = (id: string, status: ServiceHealthStatus) => {
    setInfraItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleLatencyChange = (id: string, latencyMs: number) => {
    setInfraItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, latencyMs } : item))
    );
  };

  const handleUptimeChange = (id: string, uptime: string) => {
    setInfraItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, uptime } : item))
    );
  };

  const handleDetailsChange = (id: string, details: string) => {
    setInfraItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, details } : item))
    );
  };

  const handleSaveAll = () => {
    storageService.saveInfrastructure(infraItems);
    storageService.addLog('Admin Status', 'Status de infraestrutura atualizado');
    setSaveSuccess(true);
    onRefresh();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Controle de Status da Infraestrutura Nexa</span>
          </h2>
          <p className="text-xs text-slate-400">
            Gerencie o estado operacional de servidores, rede, painel, API e DNS exibidos publicamente em /status.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:from-emerald-300 hover:to-cyan-400 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações de Status</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Status dos serviços salvos e refletidos imediatamente na página pública!</span>
        </div>
      )}

      {/* Grid of Nodes / Services */}
      <div className="space-y-4">
        {infraItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
                {item.type === 'Servidores' && <Server className="w-5 h-5" />}
                {item.type === 'Rede' && <Wifi className="w-5 h-5" />}
                {item.type === 'Painel' && <Terminal className="w-5 h-5" />}
                {item.type === 'API' && <Activity className="w-5 h-5" />}
                {item.type === 'DNS' && <ShieldCheck className="w-5 h-5" />}
                {item.type === 'Suporte' && <Activity className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{item.name}</h4>
                <span className="text-[11px] font-mono text-cyan-300">
                  {item.type} &bull; {item.location}
                </span>
              </div>
            </div>

            {/* Editing Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Estado
                </label>
                <select
                  value={item.status}
                  onChange={(e) =>
                    handleStatusChange(item.id, e.target.value as ServiceHealthStatus)
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="operacional">🟢 Operacional</option>
                  <option value="manutencao">🟡 Manutenção</option>
                  <option value="instabilidade">🟠 Instabilidade</option>
                  <option value="offline">🔴 Offline</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Ping Latência (ms)
                </label>
                <input
                  type="number"
                  value={item.latencyMs}
                  onChange={(e) =>
                    handleLatencyChange(item.id, parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Disponibilidade (%)
                </label>
                <input
                  type="text"
                  value={item.uptime}
                  onChange={(e) => handleUptimeChange(item.id, e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Mensagem Informativa
                </label>
                <input
                  type="text"
                  value={item.details || ''}
                  onChange={(e) => handleDetailsChange(item.id, e.target.value)}
                  placeholder="Ex: Operando em capacidade total"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
