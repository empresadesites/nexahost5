import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Package,
  Clock,
  Trash2,
  Shield,
  Activity,
} from 'lucide-react';
import { AdminNotification, AdminLog } from '../../types';
import { storageService } from '../../services/storage';

interface AdminNotificationsProps {
  notifications: AdminNotification[];
  logs: AdminLog[];
  onRefresh: () => void;
}

export const AdminNotifications: React.FC<AdminNotificationsProps> = ({
  notifications,
  logs,
  onRefresh,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'notifications' | 'logs'>('notifications');

  const handleMarkAsRead = (id: string) => {
    storageService.markNotificationAsRead(id);
    onRefresh();
  };

  const handleClearAll = () => {
    if (!confirm('Deseja limpar as notificações do painel?')) return;
    storageService.saveNotifications([]);
    onRefresh();
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'pedido':
        return <Package className="w-4 h-4 text-cyan-400" />;
      case 'pagamento':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'ticket':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <span>Sistema de Notificações & Auditoria Nexa</span>
          </h2>
          <p className="text-xs text-slate-400">
            Acompanhe em tempo real novos pedidos, comprovantes informados e alterações efetuadas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex text-xs">
            <button
              onClick={() => setActiveSubTab('notifications')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
                activeSubTab === 'notifications'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Notificações ({notifications.filter((n) => !n.read).length})
            </button>
            <button
              onClick={() => setActiveSubTab('logs')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
                activeSubTab === 'logs'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Logs Administrativos ({logs.length})
            </button>
          </div>

          {activeSubTab === 'notifications' && notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Limpar Notificações"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Notifications Tab */}
      {activeSubTab === 'notifications' && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>EVENTOS DO SISTEMA</span>
            <span>ORDENADOS POR HORÁRIO</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Nenhuma notificação pendente no momento.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                    notif.read ? 'bg-slate-950/40 opacity-70' : 'bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                      {getEventIcon(notif.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-xs sm:text-sm">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{notif.message}</p>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        {new Date(notif.timestamp).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(notif.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {!notif.read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 shrink-0 px-2 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 transition-colors cursor-pointer"
                    >
                      Marcar como lida
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeSubTab === 'logs' && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>HISTÓRICO DE AUDITORIA</span>
            <span>ÚLTIMAS ATIVIDADES</span>
          </div>

          <div className="divide-y divide-slate-800/80 max-h-[500px] overflow-y-auto">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Nenhum log gravado ainda.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 font-mono text-[10px] border border-slate-800">
                      {log.action}
                    </span>
                    <span className="text-slate-300">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(log.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
