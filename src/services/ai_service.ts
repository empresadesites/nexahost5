/**
 * AI_SERVICE - Camada de Atendimento Inteligente da Nexa Host
 * 
 * Arquitetura Modular:
 * 1. Camada de Conhecimento Local (zero dependência de chaves secretas para GitHub Pages).
 * 2. Hook de integração pronto para Google Gemini / OpenAI via proxy seguro backend ou Cloud Functions.
 * 3. Fallback gracioso com encaminhamento para suporte humano.
 */

import { storageService } from './storage';

export interface AIMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}

export interface AIProviderConfig {
  provider: 'local-knowledge' | 'gemini-proxy' | 'openai-proxy';
  endpointUrl?: string; // Para conexões seguras backend
  enabled: boolean;
}

export class NexaAIService {
  private config: AIProviderConfig = {
    provider: 'local-knowledge',
    enabled: true,
  };

  /**
   * Processa a mensagem do usuário e devolve resposta personalizada
   */
  async sendMessage(userMessage: string): Promise<string> {
    const trimmed = userMessage.trim().toLowerCase();
    const plans = storageService.getPlans().filter((p) => p.active);
    const settings = storageService.getSettings();

    // Simula tempo de digitação natural da IA (350ms - 600ms)
    await new Promise((res) => setTimeout(res, 450));

    // Se estiver explicitamente desativada:
    if (!this.config.enabled) {
      return 'Atendimento automático temporariamente indisponível. Você pode falar com um atendente humano em nosso SAC ou através do nosso Discord oficial.';
    }

    // 1. Perguntas sobre Planos e Preços
    if (
      trimmed.includes('plano') ||
      trimmed.includes('preço') ||
      trimmed.includes('quanto custa') ||
      trimmed.includes('valores') ||
      trimmed.includes('tabela')
    ) {
      const planList = plans
        .map((p) => `• **${p.name}**: ${p.ram}, ${p.cpu}, ${p.ssd} — **R$ ${p.price.toFixed(2).replace('.', ',')}/mês**`)
        .join('\n');

      return `Atualmente dispomos dos seguintes planos de alta performance com processadores Xeon e SSD NVMe:\n\n${planList}\n\n👑 O destaque supremo é o **Nexa Titan** com 32 GB RAM e 10 vCPUs! Deseja contratar algum agora?`;
    }

    // 2. Perguntas sobre Pagamento PIX
    if (
      trimmed.includes('pix') ||
      trimmed.includes('pagamento') ||
      trimmed.includes('pagar') ||
      trimmed.includes('chave pix') ||
      trimmed.includes('comprovante')
    ) {
      return `O pagamento na Nexa Host é feito via **PIX manual** instantâneo!\n\n🔑 **Chave PIX Oficial:**\n\`${settings.pixKey}\`\n\n**Como funciona:**\n1. Selecione o plano desejado e clique em "Contratar Agora".\n2. Realize a transferência via PIX no app do seu banco.\n3. Clique em "Já realizei o pagamento" e forneça o nome/IP desejado para a máquina.\n4. Nossa equipe valida o pagamento e ativa a sua VPS manualmente!`;
    }

    // 3. Como contratar
    if (
      trimmed.includes('contratar') ||
      trimmed.includes('comprar') ||
      trimmed.includes('assinar') ||
      trimmed.includes('como funciona a contratação')
    ) {
      return `Contratar sua VPS é muito fácil e não requer cadastro burocrático:\n\n1. Escolha o plano ideal na seção **Planos**.\n2. Preencha seu Nome, WhatsApp e E-mail.\n3. Faça o PIX com a chave informada.\n4. Informe o nome da máquina e IP desejado.\n5. Você receberá um código **NX-XXXXXX** para acompanhar o status até a ativação!`;
    }

    // 4. Como funciona a ativação / Tempo
    if (
      trimmed.includes('ativação') ||
      trimmed.includes('ativar') ||
      trimmed.includes('quanto tempo') ||
      trimmed.includes('prazo') ||
      trimmed.includes('demora')
    ) {
      return `⏱️ **Ativação Manual pela Equipe Nexa Host:**\n\nNossos técnicos configuram e provisionam cada VPS manualmente para garantir integridade física, mitigação Anti-DDoS e desempenho máximo. O tempo médio de ativação é de **15 a 45 minutos** durante o horário de atendimento comercial após o PIX confirmado.`;
    }

    // 5. Hardware, Xeon, NVMe, Anti-DDoS
    if (
      trimmed.includes('xeon') ||
      trimmed.includes('cpu') ||
      trimmed.includes('ssd') ||
      trimmed.includes('nvme') ||
      trimmed.includes('hardware') ||
      trimmed.includes('ddos') ||
      trimmed.includes('localização')
    ) {
      return `🛡️ **Infraestrutura Enterprise Nexa Host:**\n\n• **Processadores:** Intel Xeon E5 e Xeon Scalable de alta frequência.\n• **Armazenamento:** 100% SSDs NVMe em RAID 10 com altíssima taxa de IOPS.\n• **Anti-DDoS:** Proteção Anycast global de até 4.8 Tbps integrada.\n• **Localização:** Nós no Brasil (São Paulo - ultrabaixa latência) e nos EUA (Ashburn - Virginia).`;
    }

    // 6. Rastreamento e Status do Pedido
    if (
      trimmed.includes('status') ||
      trimmed.includes('meu pedido') ||
      trimmed.includes('minha vps') ||
      trimmed.includes('rastrear') ||
      trimmed.includes('onde está') ||
      trimmed.includes('nx-')
    ) {
      return `Para acompanhar seu pedido, basta acessar a aba **"Rastrear Pedido"** no menu superior e inserir seu código (ex: \`NX-849201\`). Lá você acompanha em tempo real: *Pagamento Informado*, *Em Análise*, *Ativação Pendente* e *Ativo*!`;
    }

    // 7. Suporte e Discord
    if (
      trimmed.includes('discord') ||
      trimmed.includes('comunidade') ||
      trimmed.includes('suporte') ||
      trimmed.includes('humano') ||
      trimmed.includes('atendente') ||
      trimmed.includes('falar com')
    ) {
      return `Você pode falar diretamente com nossa equipe:\n\n🎧 **Discord Oficial:** ${settings.socials.discord}\n💬 **SAC com Atendimento Humano:** Acesse a opção "Atendimento Humano" nesta mesma tela para abrir um chamado numerado!\n📱 **WhatsApp Suporte:** ${settings.phone}`;
    }

    // 8. Jogos, FiveM, Minecraft, Bots
    if (
      trimmed.includes('fivem') ||
      trimmed.includes('minecraft') ||
      trimmed.includes('jogo') ||
      trimmed.includes('jogos') ||
      trimmed.includes('bot') ||
      trimmed.includes('discord bot')
    ) {
      return `Sim! Nossas VPS são amplamente recomendadas para servidores de **FiveM, Minecraft, Rust, servidores de aplicação Node.js, Python e Bots de Discord**. Recomendamos a partir do **Nexa Advanced (8 GB RAM)** para FiveM e **Nexa Start (4 GB RAM)** para bots e micro-serviços.`;
    }

    // Resposta padrão inteligente
    return `Olá! Posso te ajudar com dúvidas sobre nossos **Planos Xeon**, **Valores**, **Chave PIX de pagamento**, **Prazos de ativação da VPS** ou te encaminhar para o **Suporte Humano** no Discord. O que você gostaria de saber?`;
  }
}

export const aiService = new NexaAIService();
