import React, { useState } from 'react';
import {
  Server,
  Zap,
  Activity,
  Headphones,
  Search,
  Menu,
  X,
  ExternalLink,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  settings?: SiteSettings;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCheckout?: () => void;
  onOpenAdmin?: () => void;
  isOwnerLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeTab,
  onSelectTab,
  onOpenCheckout,
  onOpenAdmin,
  isOwnerLoggedIn,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const companyName = settings?.companyName || 'NEXA HOST';
  const discordUrl = settings?.socials?.discord || 'https://discord.gg/8BK5UDhDU8';
  const discordActive = settings?.socials?.discordActive !== false;
  const discordButtonText = settings?.hero?.discordButtonText || 'Entrar no Discord';

  const handleNav = (tab: string) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-cyan-900/30">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-blue-950/90 via-slate-900 to-cyan-950/90 border-b border-cyan-500/10 py-1.5 px-4 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">
              STATUS DA REDE:{' '}
              <strong className="text-emerald-400 font-semibold">100% OPERACIONAL</strong>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">
              Pagamento via PIX com ativação manual rápida
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            {discordActive && (
              <a
                href={discordUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                title="Discord Oficial Nexa Host"
              >
                <MessageSquare className="w-3 h-3 text-cyan-400" />
                <span>Discord Oficial</span>
              </a>
            )}
            {isOwnerLoggedIn && onOpenAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAdmin}
                  className="text-cyan-300 hover:text-white text-[11px] font-mono tracking-wider transition-colors flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 cursor-pointer"
                  title="Acessar Painel do Dono"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Painel Dono</span>
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="text-slate-400 hover:text-rose-400 text-[10px] font-mono transition-colors cursor-pointer"
                    title="Encerrar Sessão"
                  >
                    Sair
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Server className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                {companyName}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono uppercase tracking-widest font-bold">
                VPS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">
              XEON CLOUD & NVMe
            </p>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => handleNav('home')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'home'
                ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            Início
          </button>

          <button
            onClick={() => handleNav('planos')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'planos'
                ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            Planos VPS
          </button>

          <button
            onClick={() => handleNav('rastrear')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'rastrear'
                ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Rastrear Pedido</span>
          </button>

          <button
            onClick={() => handleNav('suporte')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'suporte'
                ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-cyan-400" />
            <span>SAC & IA</span>
          </button>

          <button
            onClick={() => handleNav('status')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'status'
                ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Status</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {settings.socials.discordActive && (
            <a
              href={settings.socials.discord}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/40 hover:border-cyan-400/50 transition-all duration-300 flex items-center gap-2 group"
            >
              <span>{settings.hero.discordButtonText}</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}

          <button
            onClick={() => {
              if (onOpenCheckout) onOpenCheckout();
              else handleNav('planos');
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Contratar VPS</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-900 border border-cyan-900/50 text-cyan-300 hover:text-white focus:outline-none"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-cyan-900/40 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-4 py-2.5 rounded-lg text-slate-200 hover:bg-cyan-950/40 font-medium"
          >
            Início
          </button>
          <button
            onClick={() => handleNav('planos')}
            className="w-full text-left px-4 py-2.5 rounded-lg text-slate-200 hover:bg-cyan-950/40 font-medium"
          >
            Planos VPS
          </button>
          <button
            onClick={() => handleNav('rastrear')}
            className="w-full text-left px-4 py-2.5 rounded-lg text-slate-200 hover:bg-cyan-950/40 font-medium flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Rastrear Pedido</span>
          </button>
          <button
            onClick={() => handleNav('suporte')}
            className="w-full text-left px-4 py-2.5 rounded-lg text-slate-200 hover:bg-cyan-950/40 font-medium flex items-center gap-2"
          >
            <Headphones className="w-4 h-4 text-cyan-400" />
            <span>SAC & Atendimento IA</span>
          </button>
          <button
            onClick={() => handleNav('status')}
            className="w-full text-left px-4 py-2.5 rounded-lg text-slate-200 hover:bg-cyan-950/40 font-medium flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Status da Infraestrutura</span>
          </button>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            {discordActive && (
              <a
                href={discordUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full block text-center py-2.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/50 border border-cyan-500/30"
              >
                {discordButtonText}
              </a>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenCheckout) onOpenCheckout();
                else handleNav('planos');
              }}
              className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 text-center"
            >
              Contratar VPS Agora
            </button>

            {isOwnerLoggedIn && onOpenAdmin && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-center text-xs font-mono text-cyan-300 hover:text-white"
                >
                  👑 Painel do Dono
                </button>
                {onLogout && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="px-3 py-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono hover:text-white"
                  >
                    Sair
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
