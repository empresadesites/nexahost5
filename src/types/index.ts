export type PlanId = string;

export interface Plan {
  id: PlanId;
  name: string;
  ram: string;
  cpu: string;
  cpuType: string;
  ssd: string;
  price: number;
  billingPeriod: string;
  description: string;
  badge?: string;
  isTitan?: boolean;
  active: boolean;
  highlighted?: boolean;
  orderIndex: number;
}

export type OrderStatus =
  | 'novo'
  | 'aguardando_pagamento'
  | 'pagamento_informado'
  | 'em_analise'
  | 'pago'
  | 'ativacao_pendente'
  | 'ativo'
  | 'cancelado';

export interface Order {
  id: string; // e.g. NX-849201
  planId: string;
  planName: string;
  ram: string;
  cpu: string;
  ssd: string;
  price: number;
  customerName: string;
  customerPhone: string; // WhatsApp
  customerEmail: string;
  customerDiscord?: string;
  vpsIp?: string;
  vpsName?: string;
  // Security note: vpsPassword is never stored in storage or public code.
  // We store a masked presence indicator like `[Configurada pelo cliente - Protegido]`
  vpsPasswordProvided: boolean;
  observations?: string;
  paymentMethod: 'PIX';
  pixKey: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

export type TicketStatus =
  | 'aberto'
  | 'em_atendimento'
  | 'aguardando_cliente'
  | 'resolvido'
  | 'fechado';

export type TicketCategory =
  | 'Financeiro'
  | 'Técnico'
  | 'Vendas'
  | 'Dúvidas'
  | 'Outro';

export interface TicketMessage {
  id: string;
  author: 'cliente' | 'atendente' | 'sistema';
  authorName: string;
  content: string;
  timestamp: string;
}

export interface Ticket {
  id: string; // e.g. #1001
  orderNumber?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: 'baixa' | 'media' | 'alta';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export type ServiceHealthStatus = 'operacional' | 'manutencao' | 'instabilidade' | 'offline';

export interface InfrastructureItem {
  id: string;
  name: string;
  type: 'Servidores' | 'Rede' | 'Painel' | 'API' | 'DNS' | 'Suporte';
  location: string;
  status: ServiceHealthStatus;
  uptime: string;
  latencyMs: number;
  lastChecked: string;
  details?: string;
}

export interface SocialLinks {
  discord: string;
  discordActive: boolean;
  whatsapp: string;
  whatsappActive: boolean;
  instagram: string;
  instagramActive: boolean;
  tiktok: string;
  tiktokActive: boolean;
  youtube: string;
  youtubeActive: boolean;
  facebook: string;
  facebookActive: boolean;
  telegram: string;
  telegramActive: boolean;
}

export interface SiteSettings {
  companyName: string;
  siteTitle?: string;
  shortName: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  faviconUrl?: string;
  emailSupport: string;
  emailCommercial: string;
  phone: string;
  address: string;
  pixKey: string;
  pixReceiver: string;
  socials: SocialLinks;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    discordButtonText: string;
  };
  theme: {
    mode: 'neon-blue' | 'deep-blue' | 'cyber-cyan';
    primaryColor: string;
    enableParticles: boolean;
    enableVideo: boolean;
  };
  benefitsTitle: string;
  plansTitle: string;
  supportTitle: string;
  supportDescription: string;
  footerText: string;
}

export interface BroadcastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert' | 'pedido' | 'pagamento' | 'ticket';
  active: boolean;
  read?: boolean;
  createdAt: string;
  timestamp: string;
}

export type AdminNotification = BroadcastNotification;

export interface AdminAuditLog {
  id: string;
  admin: string;
  action: string;
  details: string;
  timestamp: string;
}

export type AdminLog = AdminAuditLog;

export interface OwnerAccount {
  emailOrUser: string;
  passwordHash: string;
  name: string;
  createdAt: string;
  lastLoginAt?: string;
  recoveryPin?: string;
}

export type AdminRole = 'dono' | 'gerente' | 'suporte';

export interface AdminRoleConfig {
  role: AdminRole;
  title: string;
  defaultPin: string;
  badge: string;
  color: string;
  description: string;
  allowedModules: Array<'dashboard' | 'orders' | 'plans' | 'tickets' | 'infra' | 'settings' | 'notifications'>;
}

export interface AdminAuthSession {
  isLoggedIn: boolean;
  role: AdminRole;
  roleTitle: string;
  user: string;
  name: string;
  loginAt: string;
}
