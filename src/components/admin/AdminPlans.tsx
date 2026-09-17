import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Crown,
  Sparkles,
  Server,
  ArrowUpDown,
} from 'lucide-react';
import { Plan } from '../../types';
import { storageService } from '../../services/storage';

interface AdminPlansProps {
  plans: Plan[];
  onRefresh: () => void;
}

export const AdminPlans: React.FC<AdminPlansProps> = ({
  plans,
  onRefresh,
}) => {
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isNewPlan, setIsNewPlan] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [ram, setRam] = useState('');
  const [cpu, setCpu] = useState('');
  const [cpuType, setCpuType] = useState('Intel Xeon E5 High Compute');
  const [ssd, setSsd] = useState('');
  const [price, setPrice] = useState<number>(54.90);
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [isTitan, setIsTitan] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const [active, setActive] = useState(true);

  const handleOpenCreate = () => {
    setIsNewPlan(true);
    setName('');
    setRam('4 GB RAM');
    setCpu('4 CPU Xeon');
    setCpuType('Intel Xeon E5 High Compute');
    setSsd('70 GB SSD NVMe');
    setPrice(54.90);
    setDescription('Ideal para servidores leves, bots e microsserviços.');
    setBadge('Novo');
    setIsTitan(false);
    setHighlighted(false);
    setActive(true);
    setEditingPlan({
      id: `nexa-custom-${Date.now()}`,
      name: '',
      ram: '',
      cpu: '',
      cpuType: '',
      ssd: '',
      price: 0,
      billingPeriod: '/mês',
      description: '',
      active: true,
      orderIndex: plans.length + 1,
    });
  };

  const handleOpenEdit = (plan: Plan) => {
    setIsNewPlan(false);
    setEditingPlan(plan);
    setName(plan.name);
    setRam(plan.ram);
    setCpu(plan.cpu);
    setCpuType(plan.cpuType);
    setSsd(plan.ssd);
    setPrice(plan.price);
    setDescription(plan.description);
    setBadge(plan.badge || '');
    setIsTitan(Boolean(plan.isTitan));
    setHighlighted(Boolean(plan.highlighted));
    setActive(plan.active);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan || !name.trim()) return;

    const currentPlans = storageService.getPlans();
    const updatedPlan: Plan = {
      ...editingPlan,
      name: name.trim(),
      ram: ram.trim(),
      cpu: cpu.trim(),
      cpuType: cpuType.trim(),
      ssd: ssd.trim(),
      price: Number(price),
      description: description.trim(),
      badge: badge.trim() || undefined,
      isTitan,
      highlighted,
      active,
    };

    if (isNewPlan) {
      currentPlans.push(updatedPlan);
      storageService.addLog('Admin Planos', `Novo plano criado: ${updatedPlan.name}`);
    } else {
      const idx = currentPlans.findIndex((p) => p.id === editingPlan.id);
      if (idx !== -1) {
        currentPlans[idx] = updatedPlan;
        storageService.addLog('Admin Planos', `Plano editado: ${updatedPlan.name}`);
      }
    }

    storageService.savePlans(currentPlans);
    setEditingPlan(null);
    onRefresh();
  };

  const handleDeletePlan = (planId: string) => {
    if (!confirm('Deseja realmente remover este plano de VPS?')) return;
    const currentPlans = storageService.getPlans().filter((p) => p.id !== planId);
    storageService.savePlans(currentPlans);
    storageService.addLog('Admin Planos', `Plano removido: ID ${planId}`);
    onRefresh();
  };

  const handleToggleActive = (plan: Plan) => {
    const currentPlans = storageService.getPlans();
    const idx = currentPlans.findIndex((p) => p.id === plan.id);
    if (idx !== -1) {
      currentPlans[idx].active = !currentPlans[idx].active;
      storageService.savePlans(currentPlans);
      storageService.addLog(
        'Admin Planos',
        `Plano ${plan.name} ${currentPlans[idx].active ? 'ativado' : 'desativado'}`
      );
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>Gerenciamento de Planos VPS Xeon</span>
          </h2>
          <p className="text-xs text-slate-400">
            Adicione novos pacotes, ajuste valores mensais, especificações de RAM/CPU/NVMe e destaques.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:from-cyan-300 hover:to-blue-400 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Plano</span>
        </button>
      </div>

      {/* Plans List Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Nome do Plano</th>
                <th className="px-5 py-3.5">Hardware (RAM &bull; CPU &bull; NVMe)</th>
                <th className="px-5 py-3.5">Valor Mensal</th>
                <th className="px-5 py-3.5">Destaque</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {p.isTitan ? (
                        <Crown className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <Server className="w-4 h-4 text-cyan-400" />
                      )}
                      <span className="font-bold text-white text-sm">{p.name}</span>
                    </div>
                    {p.badge && (
                      <span className="text-[10px] text-cyan-300 font-mono block mt-0.5">
                        Badge: {p.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-mono">
                    <span className="text-white font-semibold">{p.ram}</span>
                    <span className="text-slate-500 mx-1.5">&bull;</span>
                    <span className="text-cyan-300">{p.cpu}</span>
                    <span className="text-slate-500 mx-1.5">&bull;</span>
                    <span className="text-slate-300">{p.ssd}</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-white text-sm">
                    R$ {p.price.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-5 py-3.5">
                    {p.isTitan ? (
                      <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px] font-mono">
                        Titan Supremo
                      </span>
                    ) : p.highlighted ? (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                        Recomendado
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px] font-mono">Padrão</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleToggleActive(p)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold border transition-colors cursor-pointer ${
                        p.active
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {p.active ? '● Ativo' : '○ Desativado'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition-colors cursor-pointer inline-flex"
                      title="Editar plano"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(p.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500 hover:text-white text-slate-400 transition-colors cursor-pointer inline-flex"
                      title="Excluir plano"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-950 rounded-2xl border border-cyan-500/40 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                  {isNewPlan ? 'NOVO PLANO' : 'EDITAR PLANO'}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {isNewPlan ? 'Criar Pacote de VPS' : `Editar: ${editingPlan.name}`}
                </h3>
              </div>
              <button
                onClick={() => setEditingPlan(null)}
                className="text-slate-400 hover:text-white p-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nome do Plano *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Nexa Enterprise"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Preço Mensal (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Memória RAM *
                  </label>
                  <input
                    type="text"
                    required
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    placeholder="Ex: 8 GB RAM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    vCPUs Xeon *
                  </label>
                  <input
                    type="text"
                    required
                    value={cpu}
                    onChange={(e) => setCpu(e.target.value)}
                    placeholder="Ex: 6 CPU Xeon"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    SSD NVMe *
                  </label>
                  <input
                    type="text"
                    required
                    value={ssd}
                    onChange={(e) => setSsd(e.target.value)}
                    placeholder="Ex: 100 GB SSD NVMe"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tipo de Processador
                  </label>
                  <input
                    type="text"
                    value={cpuType}
                    onChange={(e) => setCpuType(e.target.value)}
                    placeholder="Ex: Intel Xeon Scalable Gold"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Badge / Tag Promocional
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Ex: Mais Escolhido, Popular, Recomendado"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Descrição Curta
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Resumo das aplicações ideais para este plano..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                ></textarea>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded text-cyan-500 focus:ring-0"
                  />
                  <span>Plano Ativo no Site</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highlighted}
                    onChange={(e) => setHighlighted(e.target.checked)}
                    className="rounded text-cyan-500 focus:ring-0"
                  />
                  <span>Destaque Visual</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-yellow-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTitan}
                    onChange={(e) => setIsTitan(e.target.checked)}
                    className="rounded text-yellow-500 focus:ring-0"
                  />
                  <span>👑 Destaque Titan</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all cursor-pointer"
                >
                  Salvar Plano
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
