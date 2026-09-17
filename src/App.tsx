import React, { useState, useEffect } from 'react';
import {
  Server,
  MessageSquare,
  Phone,
  ArrowUp,
  Shield,
  Activity,
  Zap,
} from 'lucide-react';

import { Plan, Order, SiteSettings } from './types';
import { storageService } from './services/storage';

import { TechBackground } from './components/TechBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TechVideoSection } from './components/TechVideoSection';
import { PlansSection } from './components/PlansSection';
import { BenefitsSection } from './components/BenefitsSection';
import { FaqSection } from './components/FaqSection';
import { OrderTracking } from './components/OrderTracking';
import { SupportHub } from './components/SupportHub';
import { InfrastructureStatus } from './components/InfrastructureStatus';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/admin/AdminPanel';
import { OwnerAuthScreen } from './components/admin/OwnerAuthScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'planos' | 'rastrear' | 'status' | 'suporte' | 'admin'>('home');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettings());
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<Plan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [trackedOrderId, setTrackedOrderId] = useState<string | undefined>(undefined);
  const [supportOrderRef, setSupportOrderRef] = useState<string | undefined>(undefined);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => storageService.isAdminLoggedIn());
  const [adminSession, setAdminSession] = useState(() => storageService.getAdminSession());

  // Secret shortcut for the owner: Ctrl+Shift+A or Alt+Shift+A opens admin
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleSelectTab('admin');
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  // Sync hash routing for GitHub Pages
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'planos', 'rastrear', 'status', 'suporte', 'admin'].includes(hash)) {
        setActiveTab(hash as any);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const loadData = () => {
    setPlans(storageService.getPlans());
    setSettings(storageService.getSettings());
    setIsAdminLoggedIn(storageService.isAdminLoggedIn());
    setAdminSession(storageService.getAdminSession());
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleSelectTab = (tab: string) => {
    window.location.hash = tab;
    setActiveTab(tab as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHirePlan = (plan: Plan) => {
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (order: Order) => {
    setTrackedOrderId(order.id);
    // Reload plans and data
    loadData();
  };

  const handleOpenSupportWithOrder = (orderId: string) => {
    setSupportOrderRef(orderId);
    handleSelectTab('suporte');
  };

  // If currently in Admin view
  if (activeTab === 'admin') {
    if (!isAdminLoggedIn) {
      return (
        <OwnerAuthScreen
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            setAdminSession(storageService.getAdminSession());
            loadData();
          }}
          onBackToSite={() => handleSelectTab('home')}
        />
      );
    }

    return (
      <AdminPanel
        onBackToSite={() => handleSelectTab('home')}
        onLogout={() => {
          storageService.logoutAdmin();
          setIsAdminLoggedIn(false);
          setAdminSession(null);
          handleSelectTab('home');
        }}
      />
    );
  }

  const rawWhatsapp = settings?.socials?.whatsapp || '5511987654321';
  const whatsappUrl = `https://wa.me/${rawWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Olá Nexa Host! Gostaria de tirar dúvidas sobre os planos de VPS.'
  )}`;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Dynamic Cyber Particle Background */}
      <TechBackground />

      {/* Admin Active Session Banner (visible only to the authenticated operator) */}
      {isAdminLoggedIn && (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border-b border-cyan-500/40 px-4 py-1.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sessão {adminSession?.roleTitle || 'Admin'} Ativa</span>
            {adminSession?.name && (
              <span className="text-slate-300">({adminSession.name})</span>
            )}
            <span className="text-slate-500 hidden sm:inline">&bull;</span>
            <span className="text-slate-400 hidden sm:inline">Atalho: Ctrl+Shift+A</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSelectTab('admin')}
              className="px-2.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors cursor-pointer text-[11px]"
            >
              Abrir Painel Admin
            </button>
            <button
              onClick={() => {
                storageService.logoutAdmin();
                setIsAdminLoggedIn(false);
                setAdminSession(null);
              }}
              className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer text-[11px]"
            >
              Sair & Bloquear
            </button>
          </div>
        </div>
      )}

      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-slate-950/90 border-b border-cyan-500/20 py-2 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono">
          <span className="inline-flex items-center gap-1.5 text-cyan-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>INFRAESTRUTURA INTEL XEON SCALABLE</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">&bull;</span>
          <span className="text-slate-300">
            Pagamento instantâneo via <strong>PIX Manual</strong> com ativação rápida
          </span>
          <span className="text-slate-600 hidden sm:inline">&bull;</span>
          <button
            onClick={() => handleSelectTab('planos')}
            className="text-cyan-400 hover:text-cyan-300 underline font-bold cursor-pointer"
          >
            Ver Planos a partir de R$ 54,90/mês
          </button>
        </div>
      </div>

      {/* Global Navigation Bar */}
      <Navbar
        settings={settings}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenCheckout={() => {
          const popular = plans.find((p) => p.highlighted) || plans[0];
          if (popular) handleHirePlan(popular);
          else handleSelectTab('planos');
        }}
        onOpenAdmin={() => handleSelectTab('admin')}
        isOwnerLoggedIn={isAdminLoggedIn}
        onLogout={() => {
          storageService.logoutAdmin();
          setIsAdminLoggedIn(false);
          setAdminSession(null);
        }}
      />

      {/* Primary Page Views */}
      <main className="relative z-10">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            <Hero
              settings={settings}
              onViewPlans={() => handleSelectTab('planos')}
              onOpenCheckout={() => {
                const popular = plans.find((p) => p.highlighted) || plans[0];
                if (popular) handleHirePlan(popular);
                else handleSelectTab('planos');
              }}
              onOpenSupport={() => handleSelectTab('suporte')}
            />

            <TechVideoSection />

            <PlansSection
              plans={plans}
              onSelectPlan={handleHirePlan}
              onHirePlan={handleHirePlan}
              onCustomQuote={() => handleSelectTab('suporte')}
            />

            <BenefitsSection />

            <InfrastructureStatus />

            <FaqSection />
          </>
        )}

        {/* PLANOS TAB */}
        {activeTab === 'planos' && (
          <div className="pt-6">
            <PlansSection
              plans={plans}
              onSelectPlan={handleHirePlan}
              onHirePlan={handleHirePlan}
              onCustomQuote={() => handleSelectTab('suporte')}
            />
            <BenefitsSection />
          </div>
        )}

        {/* RASTREAR PEDIDO TAB */}
        {activeTab === 'rastrear' && (
          <div className="pt-6">
            <OrderTracking
              initialOrderId={trackedOrderId}
              onOpenSupportWithOrder={handleOpenSupportWithOrder}
            />
          </div>
        )}

        {/* STATUS DA INFRAESTRUTURA TAB */}
        {activeTab === 'status' && (
          <div className="pt-6">
            <InfrastructureStatus />
          </div>
        )}

        {/* SUPORTE / SAC & IA TAB */}
        {activeTab === 'suporte' && (
          <div className="pt-6">
            <SupportHub
              settings={settings}
              initialOrderRef={supportOrderRef}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onSelectTab={handleSelectTab}
        onOpenAdmin={() => handleSelectTab('admin')}
        isOwnerLoggedIn={isAdminLoggedIn}
      />

      {/* Checkout Modal Flow */}
      <CheckoutModal
        plan={selectedPlanForCheckout}
        settings={settings}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Discord Floating Badge */}
        {settings?.socials?.discordActive && (
          <a
            href={settings.socials.discord}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold shadow-xl shadow-black/60 transition-all hover:scale-105"
            title="Comunidade Oficial Discord"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Discord Oficial</span>
          </a>
        )}

        {/* WhatsApp Floating Button */}
        {settings?.socials?.whatsappActive && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-xl shadow-emerald-500/30 transition-all hover:scale-105"
            title="Falar no WhatsApp"
          >
            <Phone className="w-4 h-4 fill-slate-950" />
            <span className="font-mono uppercase tracking-wider">Falar no WhatsApp</span>
          </a>
        )}

        {/* Back to Top */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 shadow-xl transition-all cursor-pointer"
            title="Voltar ao topo"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
