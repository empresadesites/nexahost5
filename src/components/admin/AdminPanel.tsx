import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Zap,
  Headphones,
  Activity,
  Settings,
  Bell,
  LogOut,
  ExternalLink,
  Shield,
  Server,
  RefreshCw,
  Crown,
  Briefcase,
} from 'lucide-react';
import { Order, Plan, Ticket, InfrastructureItem, SiteSettings, AdminNotification, AdminLog, AdminRole } from '../../types';
import { storageService, ADMIN_ROLES_CONFIG } from '../../services/storage';
import { AdminDashboard } from './AdminDashboard';
import { AdminOrders } from './AdminOrders';
import { AdminPlans } from './AdminPlans';
import { AdminTickets } from './AdminTickets';
import { AdminInfra } from './AdminInfra';
import { AdminSettings } from './AdminSettings';
import { AdminNotifications } from './AdminNotifications';

interface AdminPanelProps {
  onBackToSite: () => void;
  onLogout?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToSite, onLogout }) => {
  const adminSession = storageService.getAdminSession();
  const currentRole: AdminRole = adminSession?.role || 'dono';
  const roleConfig = ADMIN_ROLES_CONFIG[currentRole];

  // Default tab based on role permissions
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'orders' | 'plans' | 'tickets' | 'infra' | 'settings' | 'notifications'
  >(() => {
    if (currentRole === 'suporte') return 'tickets';
    return 'dashboard';
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [infra, setInfra] = useState<InfrastructureItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettings());
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);

  const loadAll = () => {
    setOrders(storageService.getOrders());
    setPlans(storageService.getPlans());
    setTickets(storageService.getTickets());
    setInfra(storageService.getInfrastructure());
    setSettings(storageService.getSettings());
    setNotifications(storageService.getNotifications());
    setLogs(storageService.getLogs());
  };

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const isModuleAllowed = (module: 'dashboard' | 'orders' | 'plans' | 'tickets' | 'infra' | 'settings' | 'notifications') => {
    return roleConfig.allowedModules.includes(module);
  };

  const getRoleIcon = () => {
    if (currentRole === 'dono') return <Crown className="w-3.5 h-3.5 text-cyan-400" />;
    if (currentRole === 'gerente') return <Briefcase className="w-3.5 h-3.5 text-amber-400" />;
    return <Headphones className="w-3.5 h-3.5 text-emerald-400" />;
  };

  const getRoleBadgeClasses = () => {
    if (currentRole === 'dono') return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
    if (currentRole === 'gerente') return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
    return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Bar */}
      <header className="h-16 border-b border-cyan-950/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Server className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white tracking-wider font-mono">
                {settings.companyName}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                PAINEL OPERACIONAL
              </span>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Admin Role Session Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium ${getRoleBadgeClasses()}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex items-center gap-1">
              {getRoleIcon()}
              <span className="font-bold uppercase tracking-wider">{roleConfig.title}</span>
            </div>
            {adminSession?.name && (
              <span className="hidden lg:inline text-slate-300 font-mono text-[11px] truncate max-w-[120px]">
                ({adminSession.name})
              </span>
            )}
          </div>

          <button
            onClick={loadAll}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            title="Atualizar dados"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {isModuleAllowed('notifications') && (
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              title="Notificações"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-mono text-[9px] font-bold flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onBackToSite}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Ver o site público"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Ver Site</span>
          </button>

          <button
            onClick={() => {
              if (onLogout) onLogout();
              else {
                storageService.logoutAdmin();
                onBackToSite();
              }
            }}
            className="px-3.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-xs font-medium text-rose-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Encerrar sessão e bloquear o painel"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair & Bloquear</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body: Sidebar + Viewport */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Módulos ({roleConfig.title})</span>
            <span className="text-cyan-400 text-[9px]">{roleConfig.allowedModules.length} ativos</span>
          </div>

          {isModuleAllowed('dashboard') && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>
          )}

          {isModuleAllowed('orders') && (
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 shrink-0" />
                <span>Pedidos VPS</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/60 text-cyan-300">
                {orders.length}
              </span>
            </button>
          )}

          {isModuleAllowed('plans') && (
            <button
              onClick={() => setActiveTab('plans')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'plans'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 shrink-0" />
                <span>Planos & Preços</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/60 text-cyan-300">
                {plans.length}
              </span>
            </button>
          )}

          {isModuleAllowed('tickets') && (
            <button
              onClick={() => setActiveTab('tickets')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'tickets'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Headphones className="w-4 h-4 shrink-0" />
                <span>SAC & Atendimentos</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/60 text-cyan-300">
                {tickets.length}
              </span>
            </button>
          )}

          {isModuleAllowed('infra') && (
            <button
              onClick={() => setActiveTab('infra')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'infra'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>Status da Infraestrutura</span>
            </button>
          )}

          {isModuleAllowed('settings') && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Configurações & PIX</span>
            </button>
          )}

          {isModuleAllowed('notifications') && (
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 shrink-0" />
                <span>Notificações & Logs</span>
              </div>
              {unreadNotificationsCount > 0 && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-bold">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

          <div className="pt-6 mt-6 border-t border-slate-800/80 px-3 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-cyan-400/80 font-mono">
              <Shield className="w-3.5 h-3.5" />
              <span>Modo Estático Seguro</span>
            </div>
            <p className="leading-tight">
              Dados persistidos em localStorage local. Pronto para transição a banco de dados em Cloud Run ou servidor dedicado.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-950">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              orders={orders}
              plans={plans}
              tickets={tickets}
              onNavigate={(mod) => setActiveTab(mod as any)}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrders orders={orders} onRefresh={loadAll} />
          )}

          {activeTab === 'plans' && (
            <AdminPlans plans={plans} onRefresh={loadAll} />
          )}

          {activeTab === 'tickets' && (
            <AdminTickets tickets={tickets} onRefresh={loadAll} />
          )}

          {activeTab === 'infra' && (
            <AdminInfra items={infra} onRefresh={loadAll} />
          )}

          {activeTab === 'settings' && (
            <AdminSettings settings={settings} onRefresh={loadAll} />
          )}

          {activeTab === 'notifications' && (
            <AdminNotifications
              notifications={notifications}
              logs={logs}
              onRefresh={loadAll}
            />
          )}
        </main>
      </div>
    </div>
  );
};
