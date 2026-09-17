import React from 'react';
import { Plan } from '../types';
import { PlanCard } from './PlanCard';
import { Cpu, Shield, Sparkles } from 'lucide-react';

interface PlansSectionProps {
  plans: Plan[];
  title?: string;
  onSelectPlan?: (plan: Plan) => void;
  onHirePlan?: (plan: Plan) => void;
  onCustomQuote?: () => void;
}

export const PlansSection: React.FC<PlansSectionProps> = ({
  plans = [],
  title = 'Escolha a Máquina Ideal para o Seu Negócio',
  onSelectPlan,
  onHirePlan,
  onCustomQuote,
}) => {
  const activePlans = (plans || [])
    .filter((p) => p.active)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const handleSelect = (plan: Plan) => {
    if (onSelectPlan) onSelectPlan(plan);
    else if (onHirePlan) onHirePlan(plan);
  };

  return (
    <section id="planos" className="py-16 md:py-24 relative">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>PLANOS VPS XEON DEDICADOS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Configurações escaláveis em hardware enterprise com memória DDR4 ECC, processadores Xeon e SSD NVMe de altíssima velocidade. Sem burocracia e com pagamento facilitado no PIX.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {activePlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={handleSelect} />
          ))}
        </div>

        {/* Bottom Hardware Info Notice */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Precisa de uma máquina personalizada?</h4>
              <p className="text-xs text-slate-400">
                Podemos criar configurações sob medida com até 64 GB de RAM e múltiplos blocos de IPv4.
              </p>
            </div>
          </div>
          {onCustomQuote ? (
            <button
              onClick={onCustomQuote}
              className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 px-4 py-2 rounded-xl border border-cyan-500/30 transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Solicitar Configuração VIP</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/50 px-4 py-2 rounded-xl border border-cyan-500/30">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Ativação Manual & Suporte Direto</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
