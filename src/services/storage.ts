import {
  Plan,
  Order,
  Ticket,
  SiteSettings,
  InfrastructureItem,
  BroadcastNotification,
  AdminAuditLog,
  OwnerAccount,
  AdminAuthSession,
  AdminRole,
  AdminRoleConfig,
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'nexa_site_settings',
  PLANS: 'nexa_plans',
  ORDERS: 'nexa_orders',
  TICKETS: 'nexa_tickets',
  INFRASTRUCTURE: 'nexa_infra_status',
  NOTIFICATIONS: 'nexa_notifications',
  LOGS: 'nexa_audit_logs',
  OWNER_ACCOUNT: 'nexa_owner_account',
  ADMIN_SESSION: 'nexa_admin_session',
  ROLE_PINS: 'nexa_admin_role_pins',
  CLEARED_FAKES_FLAG: 'nexa_cleaned_fake_orders_v2',
};

// Default Access Passwords by Role as requested:
// Suporte: 5253
// Dono: 9090
// Gerente: 9900
export const DEFAULT_ROLE_PINS: Record<AdminRole, string> = {
  dono: '9090',
  gerente: '9900',
  suporte: '5253',
};

export const ADMIN_ROLES_CONFIG: Record<AdminRole, AdminRoleConfig> = {
  dono: {
    role: 'dono',
    title: 'Proprietário & Dono',
    defaultPin: '9090',
    badge: '👑 DONO',
    color: 'from-cyan-400 to-blue-600',
    description: 'Acesso total irrestrito: pedidos, planos, preços, configurações de pagamento PIX e credenciais.',
    allowedModules: ['dashboard', 'orders', 'plans', 'tickets', 'infra', 'settings', 'notifications'],
  },
  gerente: {
    role: 'gerente',
    title: 'Gerente Geral',
    defaultPin: '9900',
    badge: '⚡ GERENTE',
    color: 'from-amber-400 to-orange-600',
    description: 'Gestão de vendas, pedidos, planos de VPS, clientes e monitoramento de infraestrutura.',
    allowedModules: ['dashboard', 'orders', 'plans', 'tickets', 'infra', 'notifications'],
  },
  suporte: {
    role: 'suporte',
    title: 'Equipe de Suporte',
    defaultPin: '5253',
    badge: '🎧 SUPORTE',
    color: 'from-emerald-400 to-teal-600',
    description: 'Atendimento de chamados (SAC), verificação de fila de pedidos e status da infraestrutura.',
    allowedModules: ['dashboard', 'tickets', 'orders', 'infra', 'notifications'],
  },
};

export const INITIAL_PLANS: Plan[] = [
  {
    id: 'nexa-start',
    name: 'Nexa Start',
    ram: '4 GB RAM',
    cpu: '4 CPU Xeon',
    cpuType: 'Intel Xeon E5 High Compute',
    ssd: '70 GB SSD NVMe',
    price: 54.90,
    billingPeriod: '/mês',
    description: 'Ideal para bots Discord, servidores leves de jogos, APIs e aplicações web iniciais.',
    badge: 'Iniciante',
    isTitan: false,
    active: true,
    highlighted: false,
    orderIndex: 1,
  },
  {
    id: 'nexa-pro',
    name: 'Nexa Pro',
    ram: '6 GB RAM',
    cpu: '5 CPU Xeon',
    cpuType: 'Intel Xeon E5 High Compute',
    ssd: '90 GB SSD NVMe',
    price: 89.90,
    billingPeriod: '/mês',
    description: 'Equilíbrio ideal entre processamento e memória para múltiplos serviços e microsserviços.',
    badge: 'Popular',
    isTitan: false,
    active: true,
    highlighted: false,
    orderIndex: 2,
  },
  {
    id: 'nexa-advanced',
    name: 'Nexa Advanced',
    ram: '8 GB RAM',
    cpu: '6 CPU Xeon',
    cpuType: 'Intel Xeon E5 High Compute',
    ssd: '100 GB SSD NVMe',
    price: 114.90,
    billingPeriod: '/mês',
    description: 'Perfeito para comunidades gamers (FiveM, Minecraft), bancos de dados e ambientes de staging.',
    badge: 'Recomendado',
    isTitan: false,
    active: true,
    highlighted: true,
    orderIndex: 3,
  },
  {
    id: 'nexa-power',
    name: 'Nexa Power',
    ram: '10 GB RAM',
    cpu: '7 CPU Xeon',
    cpuType: 'Intel Xeon E5 High Compute',
    ssd: '120 GB SSD NVMe',
    price: 134.00,
    billingPeriod: '/mês',
    description: 'Alta taxa de I/O e threads extras para renderização, proxies e aplicações concorrentes.',
    badge: 'Alta Carga',
    isTitan: false,
    active: true,
    highlighted: false,
    orderIndex: 4,
  },
  {
    id: 'nexa-ultra',
    name: 'Nexa Ultra',
    ram: '12 GB RAM',
    cpu: '8 CPU Xeon',
    cpuType: 'Intel Xeon E5 Enterprise',
    ssd: '140 GB SSD NVMe',
    price: 164.90,
    billingPeriod: '/mês',
    description: 'Performance bruta com 8 vCPUs para compilações pesadas e clusters produtivos.',
    badge: 'Potência',
    isTitan: false,
    active: true,
    highlighted: false,
    orderIndex: 5,
  },
  {
    id: 'nexa-extreme',
    name: 'Nexa Extreme',
    ram: '16 GB RAM',
    cpu: '9 CPU Xeon',
    cpuType: 'Intel Xeon E5 Enterprise',
    ssd: '180 GB SSD NVMe',
    price: 184.90,
    billingPeriod: '/mês',
    description: 'Desenvolvido para cargas críticas, pipelines de CI/CD e servidores com alto tráfego diário.',
    badge: 'Extreme',
    isTitan: false,
    active: true,
    highlighted: false,
    orderIndex: 6,
  },
  {
    id: 'nexa-titan',
    name: 'Nexa Titan 👑',
    ram: '32 GB RAM',
    cpu: '10 CPU Xeon',
    cpuType: 'Intel Xeon Scalable Gold Grade',
    ssd: '220 GB SSD NVMe',
    price: 284.90,
    billingPeriod: '/mês',
    description: 'O ápice da infraestrutura Nexa Host. Máxima vazão de rede, hardware dedicado e suporte prioritário VIP.',
    badge: '👑 SUPREMO',
    isTitan: true,
    active: true,
    highlighted: true,
    orderIndex: 7,
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: 'NEXA HOST',
  shortName: 'NEXA',
  tagline: 'Sua infraestrutura. Sem limites.',
  description: 'VPS de alta performance com processadores Xeon e armazenamento SSD NVMe para seus projetos.',
  emailSupport: 'suporte@nexahost.cloud',
  emailCommercial: 'contato@nexahost.cloud',
  phone: '+55 (11) 98765-4321',
  address: 'Datacenter Tier III - São Paulo, Brasil & Ashburn, EUA',
  pixKey: '2cb0664b-d842-440b-a578-872a5f74fa07',
  pixReceiver: 'NEXA HOST SERVIÇOS DIGITAIS LTDA',
  socials: {
    discord: 'https://discord.gg/8BK5UDhDU8',
    discordActive: true,
    whatsapp: '5511987654321',
    whatsappActive: true,
    instagram: 'https://instagram.com/nexahost',
    instagramActive: true,
    tiktok: 'https://tiktok.com/@nexahost',
    tiktokActive: true,
    youtube: 'https://youtube.com/@nexahost',
    youtubeActive: true,
    facebook: 'https://facebook.com/nexahost',
    facebookActive: false,
    telegram: 'https://t.me/nexahost',
    telegramActive: true,
  },
  hero: {
    badge: '⚡ INFRAESTRUTURA CLOUD TIER III COM XEON & NVMe',
    title: 'Sua infraestrutura. Sem limites.',
    subtitle: 'Potência bruta, link redundante anti-DDoS e ativação ágil.',
    description: 'VPS de alta performance com processadores Xeon e armazenamento SSD NVMe para seus projetos.',
    primaryButtonText: 'VER PLANOS',
    secondaryButtonText: 'CONTRATAR VPS',
    discordButtonText: 'ENTRAR NO DISCORD',
  },
  theme: {
    mode: 'neon-blue',
    primaryColor: '#00d2ff',
    enableParticles: true,
    enableVideo: true,
  },
  benefitsTitle: 'Por que a Nexa Host é a escolha certa?',
  plansTitle: 'Escolha a Máquina Ideal para o Seu Negócio',
  supportTitle: 'Suporte humanizado e ágil ao seu lado',
  supportDescription: 'Atendimento inteligente via Nexa AI ou contato direto com técnicos especializados no SAC e Discord.',
  footerText: '© 2026 NEXA HOST. Todos os direitos reservados. Revenda especializada de VPS de alta performance com ativação manual.',
};

export const INITIAL_INFRASTRUCTURE: InfrastructureItem[] = [
  {
    id: 'srv-br-01',
    name: 'Cluster Nodes Xeon - São Paulo (SP-01)',
    type: 'Servidores',
    location: 'São Paulo, BR',
    status: 'operacional',
    uptime: '99.98%',
    latencyMs: 9,
    lastChecked: 'Agora',
    details: 'Hardware principal operando com carga normal de CPU e memória.',
  },
  {
    id: 'srv-us-02',
    name: 'Cluster Nodes Xeon - Virgínia (US-01)',
    type: 'Servidores',
    location: 'Ashburn, EUA',
    status: 'operacional',
    uptime: '99.99%',
    latencyMs: 112,
    lastChecked: 'Agora',
    details: 'Nós internacionais com conectividade redundante.',
  },
  {
    id: 'net-ddos',
    name: 'Proteção Anti-DDoS Anycast (4.8 Tbps)',
    type: 'Rede',
    location: 'Global',
    status: 'operacional',
    uptime: '100%',
    latencyMs: 4,
    lastChecked: 'Agora',
    details: 'Filtros automáticos contra ataques volumétricos ativos.',
  },
  {
    id: 'pnl-core',
    name: 'Painel Central & Área do Cliente',
    type: 'Painel',
    location: 'Cluster Cloud',
    status: 'operacional',
    uptime: '99.95%',
    latencyMs: 14,
    lastChecked: 'Agora',
    details: 'Sistemas web e checkout em pleno funcionamento.',
  },
  {
    id: 'api-gateway',
    name: 'Gateway de Pedidos & Rastreamento',
    type: 'API',
    location: 'Edge Network',
    status: 'operacional',
    uptime: '100%',
    latencyMs: 11,
    lastChecked: 'Agora',
    details: 'Endpoints de consulta de status operando sem filas.',
  },
  {
    id: 'dns-anycast',
    name: 'DNS Autoritativo Redundante',
    type: 'DNS',
    location: '18 Pontos de Presença',
    status: 'operacional',
    uptime: '100%',
    latencyMs: 6,
    lastChecked: 'Agora',
    details: 'Resolução instantânea com TTL otimizado.',
  },
  {
    id: 'sup-desk',
    name: 'Atendimento Humano & Nexa AI SAC',
    type: 'Suporte',
    location: 'Central Nexa',
    status: 'operacional',
    uptime: '100%',
    latencyMs: 1,
    lastChecked: 'Agora',
    details: 'Equipe de plantão e assistência virtual respondendo normalmente.',
  },
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_TICKETS: Ticket[] = [];

export const INITIAL_NOTIFICATIONS: BroadcastNotification[] = [];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [];


// Helper Storage API
export const storageService = {
  getSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          socials: {
            ...INITIAL_SETTINGS.socials,
            ...(parsed.socials || {}),
          },
          hero: {
            ...INITIAL_SETTINGS.hero,
            ...(parsed.hero || {}),
          },
          theme: {
            ...INITIAL_SETTINGS.theme,
            ...(parsed.theme || {}),
          },
        };
      }
    } catch {
      // fallback
    }
    return INITIAL_SETTINGS;
  },

  saveSettings(settings: SiteSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getPlans(): Plan[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLANS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_PLANS;
  },

  savePlans(plans: Plan[]): void {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  },

  // Ensure old fake orders/tickets from previous localStorage are completely purged
  checkAndCleanFakes(): void {
    try {
      const cleaned = localStorage.getItem(STORAGE_KEYS.CLEARED_FAKES_FLAG);
      if (!cleaned) {
        // Clear all mock orders and tickets previously saved in browser localStorage
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.CLEARED_FAKES_FLAG, 'true');
      }
    } catch {
      // ignore
    }
  },

  getOrders(): Order[] {
    this.checkAndCleanFakes();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  },

  saveOrders(orders: Order[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  clearAllOrders(): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    this.addLog('Administração', 'Todos os pedidos foram zerados do sistema');
  },

  clearAllTickets(): void {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify([]));
    this.addLog('Administração', 'Todos os tickets foram zerados do sistema');
  },

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order {
    const orders = this.getOrders();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      ...orderData,
      id: `NX-${randomSuffix}`,
      status: 'pagamento_informado',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);
    this.addLog('Sistema Checkout', `Novo pedido recebido: ${newOrder.id} (${newOrder.planName})`);
    return newOrder;
  },

  deleteOrder(orderId: string): boolean {
    const orders = this.getOrders();
    const filtered = orders.filter((o) => o.id !== orderId);
    if (filtered.length !== orders.length) {
      this.saveOrders(filtered);
      this.addLog('Painel Admin', `Pedido ${orderId} removido do sistema`);
      return true;
    }
    return false;
  },

  updateOrderStatus(orderId: string, status: Order['status'], adminNotes?: string): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    if (adminNotes !== undefined) {
      orders[index].adminNotes = adminNotes;
    }
    this.saveOrders(orders);
    this.addLog('Painel Admin', `Status do pedido ${orderId} atualizado para "${status}"`);
    return orders[index];
  },

  getTickets(): Ticket[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_TICKETS;
  },

  saveTickets(tickets: Ticket[]): void {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  },

  createTicket(
    data: Pick<Ticket, 'customerName' | 'customerPhone' | 'customerEmail' | 'subject' | 'category' | 'orderNumber'> & {
      initialMessage: string;
    }
  ): Ticket {
    const tickets = this.getTickets();
    const nextNumber = 1000 + tickets.length + 1;
    const newTicket: Ticket = {
      id: `#${nextNumber}`,
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      subject: data.subject,
      category: data.category,
      status: 'aberto',
      priority: 'media',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          author: 'cliente',
          authorName: data.customerName,
          content: data.initialMessage,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    tickets.unshift(newTicket);
    this.saveTickets(tickets);
    this.addLog('SAC Cliente', `Novo chamado aberto: ${newTicket.id} por ${data.customerName}`);
    return newTicket;
  },

  addTicketMessage(ticketId: string, author: 'cliente' | 'atendente', authorName: string, content: string): Ticket | null {
    const tickets = this.getTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return null;
    tickets[index].messages.push({
      id: `msg-${Date.now()}`,
      author,
      authorName,
      content,
      timestamp: new Date().toISOString(),
    });
    tickets[index].updatedAt = new Date().toISOString();
    if (author === 'atendente' && tickets[index].status === 'aberto') {
      tickets[index].status = 'em_atendimento';
    }
    this.saveTickets(tickets);
    return tickets[index];
  },

  updateTicketStatus(ticketId: string, status: Ticket['status'], assignedTo?: string): Ticket | null {
    const tickets = this.getTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return null;
    tickets[index].status = status;
    tickets[index].updatedAt = new Date().toISOString();
    if (assignedTo) {
      this.addLog('SAC Operador', `Chamado ${ticketId} assumido por ${assignedTo}`);
    }
    this.saveTickets(tickets);
    return tickets[index];
  },

  getInfrastructure(): InfrastructureItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INFRASTRUCTURE);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_INFRASTRUCTURE;
  },

  saveInfrastructure(items: InfrastructureItem[]): void {
    localStorage.setItem(STORAGE_KEYS.INFRASTRUCTURE, JSON.stringify(items));
  },

  getNotifications(): BroadcastNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_NOTIFICATIONS;
  },

  saveNotifications(notifs: BroadcastNotification[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications();
    const target = notifs.find((n) => n.id === id);
    if (target) {
      target.read = true;
      this.saveNotifications(notifs);
    }
  },

  getLogs(): AdminAuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_AUDIT_LOGS;
  },

  addLog(admin: string, action: string, details: string = ''): void {
    const logs = this.getLogs();
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      admin,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    if (logs.length > 80) logs.pop();
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  resetDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(INITIAL_PLANS));
    localStorage.setItem(STORAGE_KEYS.INFRASTRUCTURE, JSON.stringify(INITIAL_INFRASTRUCTURE));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  },

  hashSecret(secret: string): string {
    let hash = 0;
    for (let i = 0; i < secret.length; i++) {
      const char = secret.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'nxh_' + Math.abs(hash).toString(16) + '_' + btoa(secret.slice(0, 3) + secret.length);
  },

  // Role passwords management (Default: Dono = 9090, Gerente = 9900, Suporte = 5253)
  getRolePins(): Record<AdminRole, string> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROLE_PINS);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          dono: parsed.dono || DEFAULT_ROLE_PINS.dono,
          gerente: parsed.gerente || DEFAULT_ROLE_PINS.gerente,
          suporte: parsed.suporte || DEFAULT_ROLE_PINS.suporte,
        };
      }
    } catch {
      // fallback
    }
    return { ...DEFAULT_ROLE_PINS };
  },

  saveRolePins(pins: Record<AdminRole, string>): void {
    localStorage.setItem(STORAGE_KEYS.ROLE_PINS, JSON.stringify(pins));
  },

  updateRolePin(role: AdminRole, newPin: string): boolean {
    if (!newPin || newPin.trim().length < 3) return false;
    const pins = this.getRolePins();
    pins[role] = newPin.trim();
    this.saveRolePins(pins);
    this.addLog('Segurança', `Senha de acesso da função [${role.toUpperCase()}] atualizada`);
    return true;
  },

  // Authenticate by checking if the typed PIN matches any of the 3 roles or a specific selected role
  verifyRoleLogin(
    enteredPassword: string,
    targetRole?: AdminRole,
    operatorName?: string
  ): { success: boolean; session?: AdminAuthSession; message?: string } {
    const cleanPass = enteredPassword.trim();
    if (!cleanPass) {
      return { success: false, message: 'Digite a senha de acesso administrativo.' };
    }

    const pins = this.getRolePins();

    let matchedRole: AdminRole | null = null;

    if (targetRole) {
      if (pins[targetRole] === cleanPass) {
        matchedRole = targetRole;
      }
    } else {
      // Auto-detect role by password if not explicitly preselected
      if (cleanPass === pins.dono) {
        matchedRole = 'dono';
      } else if (cleanPass === pins.gerente) {
        matchedRole = 'gerente';
      } else if (cleanPass === pins.suporte) {
        matchedRole = 'suporte';
      }
    }

    if (!matchedRole) {
      this.addLog('Segurança', `Tentativa de login com senha incorreta (${cleanPass.length} dígitos)`);
      return {
        success: false,
        message: targetRole
          ? `Senha incorreta para a função de ${ADMIN_ROLES_CONFIG[targetRole].title}.`
          : 'Senha administrativa incorreta. Verifique a senha da sua função.',
      };
    }

    const config = ADMIN_ROLES_CONFIG[matchedRole];
    const defaultName =
      matchedRole === 'dono'
        ? 'Dono & Fundador'
        : matchedRole === 'gerente'
        ? 'Gerente Geral'
        : 'Operador de Suporte';

    const session: AdminAuthSession = {
      isLoggedIn: true,
      role: matchedRole,
      roleTitle: config.title,
      user: operatorName?.trim() || `${matchedRole}@nexahost.cloud`,
      name: operatorName?.trim() || defaultName,
      loginAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
    this.addLog(session.name, `Login efetuado como ${config.badge} com sucesso`);

    return { success: true, session };
  },

  getAdminSession(): AdminAuthSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      if (data) {
        const parsed: AdminAuthSession = JSON.parse(data);
        if (parsed.isLoggedIn && parsed.role) return parsed;
      }
    } catch {
      // fallback
    }
    return null;
  },

  isAdminLoggedIn(): boolean {
    return this.getAdminSession() !== null;
  },

  // Backward compatibility alias for existing code
  isOwnerLoggedIn(): boolean {
    return this.isAdminLoggedIn();
  },

  getOwnerSession(): AdminAuthSession | null {
    return this.getAdminSession();
  },

  logoutAdmin(): void {
    const session = this.getAdminSession();
    if (session) {
      this.addLog(session.name, `Sessão [${session.role.toUpperCase()}] encerrada`);
    }
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  },

  logoutOwner(): void {
    this.logoutAdmin();
  },
};
