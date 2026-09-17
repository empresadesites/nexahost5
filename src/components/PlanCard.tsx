import React from 'react';
import {
  Cpu,
  HardDrive,
  Check,
  Zap,
  Crown,
  ShieldCheck,
  Activity,
  Server,
} from 'lucide-react';
import { Plan } from '../types';

interface PlanCardProps {
  plan: Plan;
  onSelect: (plan: Plan) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
  const isTitan = plan.isTitan || plan.name.toLowerCase().includes('titan');
  const isHighlighted = plan.highlighted;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 ${
        isTitan
          ? 'bg-gradient-to-b from-slate-900/95 via-indigo-950/40 to-slate-950 border-2 border-yellow-500/70 glow-gold scale-[1.02] z-10'
          : isHighlighted
          ? 'bg-slate-900/90 border-2 border-cyan-400/80 glow-blue'
          : 'glass-card glass-card-hover border-slate-800/80'
      }`}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {isTitan ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-xs font-mono font-bold tracking-wider">
            <Crown className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 animate-bounce" />
            <span>DESTAQUE SUPREMO TITAN</span>
          </div>
        ) : isHighlighted ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            <span>MAIS ESCOLHIDO</span>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Disponível
          </span>
        )}

        {plan.badge && !isTitan && !isHighlighted && (
          <span className="text-[11px] font-mono text-slate-400 uppercase">
            {plan.badge}
          </span>
        )}
      </div>

      {/* Plan Header */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          {isTitan ? (
            <Crown className="w-6 h-6 text-yellow-400" />
          ) : (
            <Server className="w-5 h-5 text-cyan-400" />
          )}
          <h3
            className={`text-2xl font-black tracking-tight ${
              isTitan
                ? 'bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent'
                : 'text-white'
            }`}
          >
            {plan.name}
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
          {plan.description}
        </p>
      </div>

      {/* Pricing block */}
      <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
        <span className="text-xs font-mono text-slate-400 block mb-1">
          Mensalidade / Ativação Manual
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-cyan-400 font-mono">R$</span>
          <span
            className={`text-3xl sm:text-4xl font-black tracking-tight ${
              isTitan ? 'text-yellow-300' : 'text-white'
            }`}
          >
            {plan.price.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-xs font-medium text-slate-400">/mês</span>
        </div>
      </div>

      {/* Hardware Specifications Grid */}
      <div className="space-y-3 mb-8 text-sm">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/40">
          <div className="flex items-center gap-2 text-slate-300">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-medium text-xs">Memória RAM:</span>
          </div>
          <span className="font-bold font-mono text-white text-xs">{plan.ram}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/40">
          <div className="flex items-center gap-2 text-slate-300">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-medium text-xs">Processador:</span>
          </div>
          <div className="text-right">
            <span className="font-bold font-mono text-white text-xs block">{plan.cpu}</span>
            <span className="text-[10px] text-slate-400">{plan.cpuType}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/40">
          <div className="flex items-center gap-2 text-slate-300">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span className="font-medium text-xs">Armazenamento:</span>
          </div>
          <span className="font-bold font-mono text-white text-xs">{plan.ssd}</span>
        </div>

        <div className="pt-2 space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Link 1 Gbps Port Redundante</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Anti-DDoS Anycast Pro Ativo</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Acesso Root SSH / Full Admin</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onSelect(plan)}
        className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
          isTitan
            ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 hover:brightness-110 shadow-lg shadow-yellow-500/20'
            : isHighlighted
            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/30'
            : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white border border-slate-700 hover:border-cyan-400'
        }`}
      >
        <Zap className="w-4 h-4" />
        <span>CONTRATAR AGORA</span>
      </button>
    </div>
  );
};
