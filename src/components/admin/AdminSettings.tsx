import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Phone,
  MessageSquare,
  Mail,
  Building,
  QrCode,
  Globe,
  Share2,
  Sliders,
  Shield,
  Key,
  Lock,
  User,
  Crown,
  Briefcase,
  Headphones,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { SiteSettings, AdminRole } from '../../types';
import { storageService, DEFAULT_ROLE_PINS, ADMIN_ROLES_CONFIG } from '../../services/storage';

interface AdminSettingsProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onRefresh,
}) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Role passwords state
  const [rolePins, setRolePins] = useState<Record<AdminRole, string>>(() => storageService.getRolePins());
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [cleanSuccess, setCleanSuccess] = useState('');

  const handleUpdateRolePins = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');

    if (!rolePins.dono || rolePins.dono.length < 3) {
      setSecurityError('A senha do Dono deve ter pelo menos 3 dígitos.');
      return;
    }
    if (!rolePins.gerente || rolePins.gerente.length < 3) {
      setSecurityError('A senha do Gerente deve ter pelo menos 3 dígitos.');
      return;
    }
    if (!rolePins.suporte || rolePins.suporte.length < 3) {
      setSecurityError('A senha do Suporte deve ter pelo menos 3 dígitos.');
      return;
    }

    storageService.saveRolePins(rolePins);
    setSecuritySuccess('Senhas de acesso de todas as funções administrativas atualizadas com sucesso!');
    setTimeout(() => setSecuritySuccess(''), 4000);
  };

  const handleResetRolePins = () => {
    setRolePins({ ...DEFAULT_ROLE_PINS });
    storageService.saveRolePins({ ...DEFAULT_ROLE_PINS });
    setSecuritySuccess('Senhas restauradas para os padrões: Dono (9090), Gerente (9900), Suporte (5253).');
    setTimeout(() => setSecuritySuccess(''), 4000);
  };

  const handlePurgeAllFakeOrders = () => {
    if (window.confirm('Tem certeza de que deseja zerar todos os pedidos e tickets? Todos os dados fictícios serão apagados.')) {
      storageService.clearAllOrders();
      storageService.clearAllTickets();
      setCleanSuccess('Todos os pedidos e chamados foram zerados do sistema com sucesso!');
      onRefresh();
      setTimeout(() => setCleanSuccess(''), 4000);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [key]: value,
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings(formData);
    storageService.addLog('Admin Configurações', 'Configurações e personalização do site atualizadas');
    setSaveSuccess(true);
    onRefresh();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span>Configurações & Personalização Nexa Host</span>
          </h2>
          <p className="text-xs text-slate-400">
            Altere a chave PIX, contatos de WhatsApp, Discord oficial, textos da página e redes sociais.
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:from-cyan-300 hover:to-blue-400 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Personalização</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Todas as alterações foram gravadas com sucesso!</span>
        </div>
      )}

      {/* 1. PIX Settings */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <QrCode className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Pagamento PIX Manual (Chave Oficial)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Chave PIX Oficial da Empresa *
            </label>
            <input
              type="text"
              required
              value={formData.pixKey}
              onChange={(e) => handleChange('pixKey', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs focus:border-cyan-400 focus:outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Chave padrão estipulada no projeto: 2cb0664b-d842-440b-a578-872a5f74fa07
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nome do Titular / Beneficiário
            </label>
            <input
              type="text"
              value={formData.pixReceiver}
              onChange={(e) => handleChange('pixReceiver', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Brand & Identity */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Building className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Identidade da Marca & Textos
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nome da Empresa
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Título da Página (SEO / Navegador)
            </label>
            <input
              type="text"
              value={formData.siteTitle}
              onChange={(e) => handleChange('siteTitle', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Descrição do Rodapé & Apresentação
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              E-mail de Atendimento
            </label>
            <input
              type="email"
              value={formData.emailSupport}
              onChange={(e) => handleChange('emailSupport', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Endereço / Polo de Operações
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Official Social Channels & WhatsApp Generator */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Share2 className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Redes Sociais & Contato Rápido
          </h3>
        </div>

        {/* Discord */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-indigo-300 mb-1">
              Link do Discord Oficial
            </label>
            <input
              type="text"
              value={formData.socials.discord}
              onChange={(e) => handleSocialChange('discord', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-indigo-400 focus:outline-none font-mono"
            />
          </div>
          <div className="pt-4">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.socials.discordActive}
                onChange={(e) => handleSocialChange('discordActive', e.target.checked)}
                className="rounded text-indigo-500 focus:ring-0"
              />
              <span>Ativar Botão do Discord no Site</span>
            </label>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-emerald-300 mb-1">
              WhatsApp de Atendimento (com DDI e DDD)
            </label>
            <input
              type="text"
              value={formData.socials.whatsapp}
              onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
              placeholder="5511999999999"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-400 focus:outline-none font-mono"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Gera automaticamente o link `https://wa.me/...` para conversa direta.
            </span>
          </div>
          <div className="pt-4">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.socials.whatsappActive}
                onChange={(e) => handleSocialChange('whatsappActive', e.target.checked)}
                className="rounded text-emerald-500 focus:ring-0"
              />
              <span>Ativar Botão do WhatsApp no Site</span>
            </label>
          </div>
        </div>

        {/* Other Socials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Instagram (@ ou URL)
            </label>
            <input
              type="text"
              value={formData.socials.instagram || ''}
              onChange={(e) => handleSocialChange('instagram', e.target.value)}
              placeholder="https://instagram.com/nexahost"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              YouTube
            </label>
            <input
              type="text"
              value={formData.socials.youtube || ''}
              onChange={(e) => handleSocialChange('youtube', e.target.value)}
              placeholder="https://youtube.com/@nexahost"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              TikTok
            </label>
            <input
              type="text"
              value={formData.socials.tiktok || ''}
              onChange={(e) => handleSocialChange('tiktok', e.target.value)}
              placeholder="https://tiktok.com/@nexahost"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Telegram
            </label>
            <input
              type="text"
              value={formData.socials.telegram || ''}
              onChange={(e) => handleSocialChange('telegram', e.target.value)}
              placeholder="https://t.me/nexahost"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Role Passwords & Security Management */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Senhas de Acesso por Função Administrativa
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-mono">
            CONTROLE DE ACESSO
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Cada operador utiliza a sua respectiva senha para desbloquear o painel. Conforme suas instruções:
          <strong> Dono = 9090</strong>, <strong>Gerente = 9900</strong> e <strong>Suporte = 5253</strong>.
        </p>

        {securitySuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{securitySuccess}</span>
          </div>
        )}

        {securityError && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>{securityError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Dono PIN */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-cyan-400" />
                <span>Senha do Dono</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded">
                Acesso Total
              </span>
            </div>
            <input
              type="text"
              value={rolePins.dono}
              onChange={(e) => setRolePins({ ...rolePins, dono: e.target.value })}
              placeholder="9090"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm tracking-widest focus:border-cyan-400 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 block">Padrão: 9090</span>
          </div>

          {/* Gerente PIN */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Senha do Gerente</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded">
                Gestão Geral
              </span>
            </div>
            <input
              type="text"
              value={rolePins.gerente}
              onChange={(e) => setRolePins({ ...rolePins, gerente: e.target.value })}
              placeholder="9900"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm tracking-widest focus:border-amber-400 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 block">Padrão: 9900</span>
          </div>

          {/* Suporte PIN */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-emerald-400" />
                <span>Senha do Suporte</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                SAC & Tickets
              </span>
            </div>
            <input
              type="text"
              value={rolePins.suporte}
              onChange={(e) => setRolePins({ ...rolePins, suporte: e.target.value })}
              placeholder="5253"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm tracking-widest focus:border-emerald-400 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 block">Padrão: 5253</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleResetRolePins}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            Restaurar senhas padrão (9090 / 9900 / 5253)
          </button>
          <button
            type="button"
            onClick={handleUpdateRolePins}
            className="px-4 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Salvar Senhas das Funções</span>
          </button>
        </div>
      </div>

      {/* 6. Purge / Clean Mock Data Section */}
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
        <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Limpeza de Banco de Dados Fictício
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-mono">
            DADOS LIMPOS
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Remova imediatamente todos os pedidos e tickets de teste do sistema para manter apenas pedidos reais recebidos dos clientes.
        </p>

        {cleanSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{cleanSuccess}</span>
          </div>
        )}

        <div className="pt-1 flex items-center justify-end">
          <button
            type="button"
            onClick={handlePurgeAllFakeOrders}
            className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Zerar Todos os Pedidos e Chamados</span>
          </button>
        </div>
      </div>
    </form>
  );
};
