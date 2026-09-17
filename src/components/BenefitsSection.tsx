import React from 'react';
import {
  Zap,
  Cpu,
  HardDrive,
  ShieldCheck,
  TrendingUp,
  Headphones,
  Wifi,
  Clock,
  Sparkles,
} from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      title: 'Alta Performance',
      description: 'Arquitetura otimizada para mínima latência e máxima vazão de instruções por ciclo.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      title: 'Processadores Xeon',
      description: 'Potência multicore enterprise com frequências turbo elevadas para aplicações exigentes.',
    },
    {
      icon: <HardDrive className="w-6 h-6 text-cyan-400" />,
      title: 'SSD NVMe',
      description: 'Armazenamento ultra veloz com taxas de leitura e escrita até 6x superiores aos SSDs SATA.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
      title: 'Infraestrutura Segura',
      description: 'Datacenters Tier III com redundância de energia, controle de acesso físico e isolamento lógico.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-cyan-400" />,
      title: 'Escalabilidade',
      description: 'Migre de plano a qualquer momento sem complicação quando seus projetos demandarem mais recursos.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-cyan-400" />,
      title: 'Suporte Dedicado',
      description: 'Atendimento humanizado via SAC e comunidade no Discord com técnicos que entendem do assunto.',
    },
    {
      icon: <Wifi className="w-6 h-6 text-cyan-400" />,
      title: 'Rede Estável & Anti-DDoS',
      description: 'Links diretos com os principais backbones brasileiros e mitigação automatizada contra ataques.',
    },
    {
      icon: <Clock className="w-6 h-6 text-cyan-400" />,
      title: 'Provisionamento Rápido',
      description: 'Ativação manual cuidadosa realizada em poucos minutos após a identificação do pagamento PIX.',
    },
  ];

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>VANTAGENS EXCLUSIVAS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Construído para Cargas Críticas e Máxima Estabilidade
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Confira o conjunto de diferenciais que tornam a Nexa Host a parceira definitiva para suas VPS.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl glass-card glass-card-hover border border-slate-800/80 space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-950/50">
              {b.icon}
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">{b.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
