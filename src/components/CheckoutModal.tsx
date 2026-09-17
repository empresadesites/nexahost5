import React, { useState } from 'react';
import {
  X,
  Check,
  Copy,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Server,
  Lock,
  QrCode,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Plan, Order, SiteSettings } from '../types';
import { storageService } from '../services/storage';

interface CheckoutModalProps {
  plan: Plan | null;
  settings: SiteSettings;
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  plan,
  settings,
  isOpen,
  onClose,
  onOrderCompleted,
}) => {
  // Steps: 1 = Client info, 2 = PIX payment, 3 = VPS Configuration, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Client form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [discord, setDiscord] = useState('');

  // VPS Preferences form (IP & Password are generated/assigned by administrators after payment approval)
  const [vpsName, setVpsName] = useState('');
  const [osChoice, setOsChoice] = useState('Ubuntu 22.04 LTS');
  const [observations, setObservations] = useState('');

  // State flags
  const [copiedPix, setCopiedPix] = useState(false);
  const [formError, setFormError] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isOpen || !plan) return null;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(settings.pixKey);
    setCopiedPix(true);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setFormError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setFormError('');
    setStep(2);
  };

  const handlePixPaid = () => {
    setStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalVpsName = vpsName.trim() || `vps-${name.trim().split(' ')[0].toLowerCase()}`;

    // Note: IP and password are deliberately NOT chosen by the customer.
    // They are set by the administrators in the admin panel upon approving the payment.
    const newOrder = storageService.createOrder({
      planId: plan.id,
      planName: plan.name,
      ram: plan.ram,
      cpu: plan.cpu,
      ssd: plan.ssd,
      price: plan.price,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerEmail: email.trim(),
      customerDiscord: discord.trim() || undefined,
      vpsIp: undefined, // Assigned by administrator upon payment approval
      vpsName: finalVpsName,
      osChoice: osChoice,
      observations: observations.trim() || undefined,
      paymentMethod: 'PIX',
      pixKey: settings.pixKey,
    });

    setCreatedOrder(newOrder);
    setStep(4);

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
    });

    onOrderCompleted(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-950 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 overflow-hidden my-8">
        {/* Top glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"></div>

        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              CHECKOUT // NEXA HOST
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Contratação:</span>
              <span className="text-cyan-300">{plan.name}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Plan Summary strip */}
        <div className="bg-slate-900/90 px-6 py-3 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
              {plan.ram}
            </span>
            <span className="bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
              {plan.cpu}
            </span>
            <span className="bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
              {plan.ssd}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[11px] block">Mensalidade:</span>
            <span className="text-base font-bold text-cyan-300 font-mono">
              R$ {plan.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-900">
          <span className={step === 1 ? 'text-cyan-400 font-bold' : step > 1 ? 'text-emerald-400' : ''}>
            1. Dados Pessoais
          </span>
          <span>→</span>
          <span className={step === 2 ? 'text-cyan-400 font-bold' : step > 2 ? 'text-emerald-400' : ''}>
            2. Pagamento PIX
          </span>
          <span>→</span>
          <span className={step === 3 ? 'text-cyan-400 font-bold' : step > 3 ? 'text-emerald-400' : ''}>
            3. Dados da VPS
          </span>
          <span>→</span>
          <span className={step === 4 ? 'text-emerald-400 font-bold' : ''}>
            4. Confirmação
          </span>
        </div>

        {/* Step 1: Customer Info */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">Identificação do Contratante</h3>
              <p className="text-xs text-slate-400">
                Não é necessário criar senha ou conta. Utilizaremos esses contatos para enviar as confirmações e o IP da sua VPS.
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Eduardo Silva"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  WhatsApp (com DDD) *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: (11) 98765-4321"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Usuário do Discord (Opcional)
              </label>
              <input
                type="text"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                placeholder="Ex: usuario#0000 ou @usuario"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Recomendado para suporte direto em canais VIP no Discord.
              </span>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>CONTINUAR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Manual PIX Payment */}
        {step === 2 && (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 text-xs font-mono mb-1">
                <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>PAGAMENTO VIA PIX MANUAL</span>
              </div>
              <h3 className="text-lg font-bold text-white">Transferência PIX Instantânea</h3>
              <p className="text-xs text-slate-400">
                Valor exato a ser transferido: <strong className="text-cyan-300 text-sm font-mono">R$ {plan.price.toFixed(2).replace('.', ',')}</strong>
              </p>
            </div>

            {/* QR Code and Key container */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/20 text-center space-y-4">
              {/* Simulated high-fidelity PIX QR Code representation */}
              <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-xl shadow-lg shadow-black flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                    settings.pixKey
                  )}`}
                  alt="QR Code PIX Nexa Host"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-400 block mb-1">
                  Chave PIX (Aleatória):
                </span>
                <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                  <input
                    type="text"
                    readOnly
                    value={settings.pixKey}
                    className="w-full px-3 py-2 text-xs font-mono text-cyan-300 bg-slate-950 border border-slate-700 rounded-lg text-center"
                  />
                  <button
                    onClick={handleCopyPix}
                    className={`px-3 py-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 shrink-0 ${
                      copiedPix
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                    }`}
                  >
                    {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPix ? 'COPIADO!' : 'COPIAR CHAVE PIX'}</span>
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Beneficiário: {settings.pixReceiver}
                </span>
              </div>
            </div>

            {/* Instructions list exactly as requested */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
              <span className="font-semibold text-cyan-300 uppercase tracking-wider block font-mono text-[11px]">
                Instruções de Pagamento:
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                <li>Copie a chave PIX no botão acima.</li>
                <li>Abra o aplicativo do seu banco e realize o pagamento no valor de <strong className="text-white font-mono">R$ {plan.price.toFixed(2).replace('.', ',')}</strong>.</li>
                <li>Depois de realizar o pagamento, clique no botão <strong className="text-cyan-300">"Já realizei o pagamento"</strong> para informar os dados de configuração.</li>
              </ol>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Voltar aos dados
              </button>
              <button
                onClick={handlePixPaid}
                className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:from-emerald-300 hover:to-cyan-300 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>JÁ REALIZEI O PAGAMENTO</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: VPS Configuration Data */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                PREFERÊNCIAS DO SERVIDOR VPS
              </h3>
              <p className="text-xs text-slate-400">
                Personalize o sistema operacional e identificação da sua máquina. O provisionamento e liberação de acesso serão realizados após a aprovação manual do PIX.
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Informational banner explaining that admin provisions IP and credentials */}
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-cyan-300 block font-mono text-[11px] uppercase tracking-wider">
                  Alocação de IP e Credenciais pela Administração
                </strong>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  O <strong>endereço IP dedicado</strong>, usuário de acesso (root/admin) e a <strong>senha segura</strong> são configurados e liberados pela administração no painel assim que o pagamento for aprovado. Você receberá todos os dados prontos no seu WhatsApp e na tela de rastreamento.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Sistema Operacional Desejado *
              </label>
              <select
                value={osChoice}
                onChange={(e) => setOsChoice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-sm font-mono cursor-pointer"
              >
                <option value="Ubuntu 24.04 LTS (Noble Numbat)">Ubuntu 24.04 LTS (Mais Recente)</option>
                <option value="Ubuntu 22.04 LTS (Jammy Jellyfish)">Ubuntu 22.04 LTS (Recomendado para FiveM / Bots / Web)</option>
                <option value="Debian 12 (Bookworm)">Debian 12 Bookworm (Alta Estabilidade)</option>
                <option value="Debian 11 (Bullseye)">Debian 11 Bullseye</option>
                <option value="Windows Server 2022 Standard">Windows Server 2022 Standard (RDP / Área de Trabalho)</option>
                <option value="Windows Server 2019 Datacenter">Windows Server 2019 Datacenter</option>
                <option value="AlmaLinux 9 (RHEL Compatible)">AlmaLinux 9 (Compatível cPanel/Plesk)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nome de Identificação da VPS (Hostname Opcional)
              </label>
              <input
                type="text"
                value={vpsName}
                onChange={(e) => setVpsName(e.target.value)}
                placeholder="Ex: servidor-fivem, bot-discord ou app-prod"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Deixe em branco para usar o nome padrão baseado no seu primeiro nome.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Observações Adicionais para a Equipe de Ativação (Opcional)
              </label>
              <textarea
                rows={2}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Ex: Portas específicas a liberar, versão de nodejs ou python, etc..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
              ></textarea>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Voltar ao PIX
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Server className="w-4 h-4" />
                <span>FINALIZAR PEDIDO</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Order Received / Confirmed */}
        {step === 4 && createdOrder && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Pedido recebido!</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Seu pedido foi registrado em nossa fila de ativação manual. Guarde o número abaixo para acompanhar o status em tempo real.
              </p>
            </div>

            {/* Order Card */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-left space-y-4 max-w-md mx-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400 font-mono">Número do Pedido:</span>
                <span className="text-lg font-mono font-black text-cyan-400 tracking-wider">
                  {createdOrder.id}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Plano Contratado:</span>
                  <span className="font-semibold text-white">{createdOrder.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Valor Mensal:</span>
                  <span className="font-mono font-bold text-cyan-300">
                    R$ {createdOrder.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data do Pedido:</span>
                  <span className="text-slate-300">
                    {new Date(createdOrder.createdAt).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(createdOrder.createdAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Status Atual:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-xs font-mono font-medium">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
                    🟡 Aguardando confirmação do pagamento
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all cursor-pointer"
              >
                Acompanhar na Área do Cliente
              </button>

              {settings.socials.discordActive && (
                <a
                  href={settings.socials.discord}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 hover:bg-cyan-900/60 flex items-center justify-center gap-2"
                >
                  <span>Entrar no Discord para Agilizar</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
