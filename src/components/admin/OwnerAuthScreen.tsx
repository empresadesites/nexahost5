import React, { useState } from 'react';
import {
  Shield,
  Lock,
  User,
  Key,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Headphones,
  Briefcase,
  Crown,
  Sparkles,
} from 'lucide-react';
import { storageService, ADMIN_ROLES_CONFIG } from '../../services/storage';
import { AdminRole } from '../../types';

interface OwnerAuthScreenProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const OwnerAuthScreen: React.FC<OwnerAuthScreenProps> = ({
  onLoginSuccess,
  onBackToSite,
}) => {
  // Roles list
  const rolesList: AdminRole[] = ['dono', 'gerente', 'suporte'];

  // Current selected role for direct focused login or 'auto'
  const [selectedRole, setSelectedRole] = useState<AdminRole | 'auto'>('auto');
  const [password, setPassword] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!password.trim()) {
      setErrorMsg('Informe a senha de acesso.');
      return;
    }

    setIsSubmitting(true);

    const targetRole = selectedRole === 'auto' ? undefined : selectedRole;
    const res = storageService.verifyRoleLogin(password, targetRole, operatorName);

    if (res.success && res.session) {
      const roleCfg = ADMIN_ROLES_CONFIG[res.session.role];
      setSuccessMsg(`Acesso autorizado como ${roleCfg.title}! Liberando painel...`);
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    } else {
      setIsSubmitting(false);
      setErrorMsg(res.message || 'Senha incorreta para a função informada.');
    }
  };

  // Quick preset click
  const handleSelectRolePreset = (role: AdminRole) => {
    setSelectedRole(role);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Cyber Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-lg relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-0.5 shadow-2xl shadow-cyan-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono tracking-wider uppercase mb-1.5">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Acesso Restrito // Funções Administrativas</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              NEXA HOST &bull; TERMINAL ADMIN
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Selecione sua função e digite a senha correspondente para acessar o painel de gerenciamento.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/95 border border-cyan-500/30 shadow-2xl shadow-black/80 backdrop-blur-xl space-y-5">
          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Role selector cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Selecione sua Função Administrativa:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Dono */}
              <button
                type="button"
                onClick={() => handleSelectRolePreset('dono')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedRole === 'dono'
                    ? 'bg-cyan-950/90 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Crown className={`w-4 h-4 ${selectedRole === 'dono' ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    Master
                  </span>
                </div>
                <div className="text-xs font-bold text-white">Dono</div>
                <div className="text-[10px] text-slate-400">Acesso Total</div>
              </button>

              {/* Gerente */}
              <button
                type="button"
                onClick={() => handleSelectRolePreset('gerente')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedRole === 'gerente'
                    ? 'bg-amber-950/80 border-amber-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Briefcase className={`w-4 h-4 ${selectedRole === 'gerente' ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                    Gestão
                  </span>
                </div>
                <div className="text-xs font-bold text-white">Gerente</div>
                <div className="text-[10px] text-slate-400">Vendas & Infra</div>
              </button>

              {/* Suporte */}
              <button
                type="button"
                onClick={() => handleSelectRolePreset('suporte')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedRole === 'suporte'
                    ? 'bg-emerald-950/80 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Headphones className={`w-4 h-4 ${selectedRole === 'suporte' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    SAC
                  </span>
                </div>
                <div className="text-xs font-bold text-white">Suporte</div>
                <div className="text-[10px] text-slate-400">Chamados</div>
              </button>
            </div>

            {/* Quick helper for auto-detect */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>
                {selectedRole === 'auto'
                  ? '💡 Dica: Digite a senha que o sistema identifica sua função automaticamente.'
                  : `Função selecionada: ${ADMIN_ROLES_CONFIG[selectedRole].title}`}
              </span>
              {selectedRole !== 'auto' && (
                <button
                  type="button"
                  onClick={() => setSelectedRole('auto')}
                  className="text-cyan-400 hover:underline cursor-pointer"
                >
                  Identificar pela senha
                </button>
              )}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Identificação do Operador / Nome (Opcional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  placeholder="Ex: Matheus ou Atendente 01"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>
                  Senha de Acesso {selectedRole !== 'auto' ? `(${ADMIN_ROLES_CONFIG[selectedRole].title})` : ''} *
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {selectedRole === 'dono' && 'Dono: 9090'}
                  {selectedRole === 'gerente' && 'Gerente: 9900'}
                  {selectedRole === 'suporte' && 'Suporte: 5253'}
                  {selectedRole === 'auto' && '9090 / 9900 / 5253'}
                </span>
              </label>

              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="Digite a senha de 4 dígitos"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono tracking-widest focus:border-cyan-400 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-slate-950 font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Verificando...' : 'Acessar Painel Operacional'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Role credentials reference card */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] space-y-1 font-mono text-slate-400">
            <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider mb-1">
              Senhas de Acesso Configuradas:
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Crown className="w-3 h-3" /> Dono:
              </span>
              <span className="bg-slate-900 px-2 py-0.5 rounded text-cyan-300 font-bold border border-cyan-500/30">9090</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Briefcase className="w-3 h-3" /> Gerente:
              </span>
              <span className="bg-slate-900 px-2 py-0.5 rounded text-amber-300 font-bold border border-amber-500/30">9900</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Headphones className="w-3 h-3" /> Suporte:
              </span>
              <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-300 font-bold border border-emerald-500/30">5253</span>
            </div>
          </div>

          {/* Footer Back action */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={onBackToSite}
              className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para o Site</span>
            </button>

            <span className="text-[10px] text-slate-500 font-mono">
              Atalho Secreto: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Ctrl+Shift+A</kbd>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
