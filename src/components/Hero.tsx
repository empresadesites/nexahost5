import React from 'react';
import {
  Server,
  Zap,
  Shield,
  Cpu,
  HardDrive,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroProps {
  settings?: SiteSettings;
  onViewPlans: () => void;
  onOpenCheckout: () => void;
  onOpenSupport: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onViewPlans,
  onOpenCheckout,
  onOpenSupport,
}) => {
  const badge = settings?.hero?.badge || '⚡ INFRAESTRUTURA CLOUD TIER III COM XEON & NVMe';
  const title = settings?.hero?.title || 'Sua infraestrutura. Sem limites.';
  const description = settings?.hero?.description || 'VPS de alta performance com processadores Xeon e armazenamento SSD NVMe para seus projetos. Ativação manual ágil, suporte especializado e estabilidade comprovada.';
  const primaryButtonText = settings?.hero?.primaryButtonText || 'VER PLANOS';
  const secondaryButtonText = settings?.hero?.secondaryButtonText || 'CONTRATAR VPS';
  const discordButtonText = settings?.hero?.discordButtonText || 'ENTRAR NO DISCORD';
  const discordUrl = settings?.socials?.discord || 'https://discord.gg/8BK5UDhDU8';
  const discordActive = settings?.socials?.discordActive !== false;

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Glow gradient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-cyan-500/15 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wider shadow-lg shadow-cyan-950/80 animate-pulse-slow">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>{badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            {title}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* 4 Action Buttons as requested */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            {/* 1. VER PLANOS */}
            <button
              onClick={onViewPlans}
              className="px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all duration-300 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>{primaryButtonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* 2. CONTRATAR VPS */}
            <button
              onClick={onOpenCheckout}
              className="px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-black/60 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{secondaryButtonText}</span>
            </button>

            {/* 3. SUPORTE */}
            <button
              onClick={onOpenSupport}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider text-slate-200 bg-slate-950/80 border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-300 transition-all duration-300 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Headphones className="w-4 h-4 text-cyan-400" />
              <span>SUPORTE</span>
            </button>

            {/* 4. ENTRAR NO DISCORD */}
            {discordActive && (
              <a
                href={discordUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider text-indigo-200 bg-[#5865F2]/20 border border-[#5865F2]/50 hover:bg-[#5865F2]/30 hover:border-[#5865F2] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#5865F2]/10 transform hover:-translate-y-0.5"
              >
                <MessageSquare className="w-4 h-4 text-[#5865F2]" />
                <span>{discordButtonText}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}
          </div>

          {/* Quick trust metrics row */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="glass-card p-3.5 rounded-xl border border-cyan-900/40">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-mono font-semibold">PROCESSADORES</span>
              </div>
              <p className="text-sm font-bold text-white">Intel Xeon E5</p>
              <p className="text-[11px] text-slate-400">Até 10 vCPUs por máquina</p>
            </div>

            <div className="glass-card p-3.5 rounded-xl border border-cyan-900/40">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <HardDrive className="w-4 h-4" />
                <span className="text-xs font-mono font-semibold">DISCOS NVMe</span>
              </div>
              <p className="text-sm font-bold text-white">100% NVMe RAID</p>
              <p className="text-[11px] text-slate-400">70 GB até 220 GB ultra rápidos</p>
            </div>

            <div className="glass-card p-3.5 rounded-xl border border-cyan-900/40">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-mono font-semibold">PROTEÇÃO DDOS</span>
              </div>
              <p className="text-sm font-bold text-white">Inclusa Grátis</p>
              <p className="text-[11px] text-slate-400">Mitigação Anycast global</p>
            </div>

            <div className="glass-card p-3.5 rounded-xl border border-cyan-900/40">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-mono font-semibold">ATIVAÇÃO</span>
              </div>
              <p className="text-sm font-bold text-white">Manual Dedicada</p>
              <p className="text-[11px] text-slate-400">Configuração precisa sem erros</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
