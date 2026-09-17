import React from 'react';
import {
  Server,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Shield,
  Activity,
  Heart,
  Lock,
} from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings?: SiteSettings;
  onSelectTab: (tab: string) => void;
  onOpenAdmin?: () => void;
  isOwnerLoggedIn?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onSelectTab,
  onOpenAdmin,
  isOwnerLoggedIn,
}) => {
  const companyName = settings?.companyName || 'NEXA HOST';
  const description = settings?.description || 'VPS de alta performance com processadores Xeon e armazenamento SSD NVMe para seus projetos.';
  const emailSupport = settings?.emailSupport || 'suporte@nexahost.cloud';
  const phone = settings?.phone || '+55 (11) 98765-4321';
  const address = settings?.address || 'Datacenter Tier III - São Paulo, Brasil & Ashburn, EUA';
  const footerText = settings?.footerText || '© 2026 NEXA HOST. Todos os direitos reservados. Revenda especializada de VPS.';
  const discordActive = settings?.socials?.discordActive !== false;
  const discordUrl = settings?.socials?.discord || 'https://discord.gg/8BK5UDhDU8';
  const whatsappActive = settings?.socials?.whatsappActive !== false;
  const rawWhatsapp = settings?.socials?.whatsapp || '5511987654321';

  const whatsappUrl = `https://wa.me/${rawWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Olá Nexa Host! Gostaria de tirar dúvidas sobre os planos de VPS.'
  )}`;

  return (
    <footer className="relative bg-slate-950 border-t border-cyan-900/30 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Server className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-black text-white tracking-wider">
                {companyName}
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              {description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {discordActive && (
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-900/60 transition-colors flex items-center gap-2 font-medium"
                >
                  <MessageSquare className="w-4 h-4 text-[#5865F2]" />
                  <span>Discord Oficial</span>
                </a>
              )}

              {whatsappActive && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/60 transition-colors flex items-center gap-2 font-medium"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>FALAR NO WHATSAPP</span>
                </a>
              )}
            </div>
          </div>

          {/* Col 3: Navegação */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('planos')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Planos Xeon NVMe
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('rastrear')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Acompanhar Pedido
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('status')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Status da Infraestrutura
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('suporte')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Central de Suporte & IA
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contatos Oficiais */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Contatos
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{emailSupport}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{address}</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Segurança & Pagamento */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Pagamentos & Confiança
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold font-mono text-xs">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>PIX MANUAL SEGURO</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Transferência direta sem intermediários financeiros. Ativação manual confirmada pela equipe.
              </p>
            </div>
            {isOwnerLoggedIn && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-xs font-mono transition-colors pt-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Painel do Dono (Conectado)</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>{footerText}</p>
          <div className="flex items-center gap-4">
            <span
              onClick={onOpenAdmin}
              className="text-cyan-400 font-mono select-none cursor-default"
              title="Cluster Status"
            >
              Status: 99.98% Uptime
            </span>
            {isOwnerLoggedIn && onOpenAdmin && (
              <>
                <span>&bull;</span>
                <button
                  onClick={onOpenAdmin}
                  className="text-cyan-400 hover:text-cyan-300 font-mono uppercase cursor-pointer"
                >
                  Painel Dono
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
