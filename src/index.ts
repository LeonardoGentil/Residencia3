import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { listCompanies } from './tools/list-companies.js';
import { getCompanyServices } from './tools/get-company-services.js';
import { getAvailableDates } from './tools/get-available-dates.js';
import { getAvailableSessions } from './tools/get-available-sessions.js';
import { getBookingForm } from './tools/get-booking-form.js';
import { scheduleAppointment } from './tools/schedule-appointment.js';
import { checkTicketStatus } from './tools/check-ticket-status.js';
import { listMyTickets } from './tools/list-my-tickets.js';
import { resources } from './resources/index.js';
import { prompts } from './prompts/index.js';

const server = new McpServer({
  name: 'filazero-mcp',
  version: '1.0.0',
});

// ─── TOOLS ───────────────────────────────────────────────

server.tool(
  'list_companies',
  'Lista todas as empresas disponíveis para agendamento na plataforma Filazero',
  {},
  async () => {
    const result = await listCompanies();
    return { content: [{ type: 'text', text: result }] };
  }
);

server.tool(
  'get_company_services',
  'Retorna os serviços disponíveis de uma empresa específica',
  { slug: z.string().describe('Slug da empresa') },
  async ({ slug }) => {
    const result = await getCompanyServices(slug);
    return { content: [{ type: 'text', text: result }] };
  }
);

server.tool(
  'get_available_dates',
  'Retorna os dias do mês que têm vagas disponíveis para um serviço',
  {
    slug: z.string().describe('Slug da empresa'),
    serviceId: z.number().describe('ID do serviço (usar abstractServiceId quando disponível)'),
    year: z.number().describe('Ano (ex: 2025)'),
    month: z.number().describe('Mês (1-12)'),
  },
  async ({ slug, serviceId, year, month }) => {
    const result = await getAvailableDates(slug, serviceId, year, month);
    return { content: [{ type: 'text', text: result }] };
  }
);

server.tool(
  'get_available_sessions',
  'Retorna os horários e profissionais disponíveis em um dia específico',
  {
    slug: z.string().describe('Slug da empresa'),
    locationId: z.number().describe('ID da unidade de atendimento'),
    serviceId: z.number().describe('ID do serviço'),
    date: z.string().describe('Data no formato YYYY-MM-DD'),
  },
  async ({ slug, locationId, serviceId, date }) => {
    const result = await getAvailableSessions(slug, locationId, serviceId, date);
    return { content: [{ type: 'text', text: result }] };
  }
);

server.tool(
  'get_booking_form',
  'Retorna os campos personalizados do formulário de agendamento',
  {
    providerId: z.number().describe('ID do prestador'),
    sessionId: z.number().describe('ID da sessão escolhida'),
  },
  async ({ providerId, sessionId }) => {
    const result = await getBookingForm(providerId, sessionId);
    return { content: [{ type: 'text', text: result }] };
  }
);

server.tool(
  'schedule_appointment',
  'Emite o ticket de agendamento. Requer token de autenticação Bearer',
  {
    sessionId: z.number().describe('ID da sessão'),
    serviceId: z.number().describe('ID do serviço'),
    locationId: z.number().describe('ID da unidade'),
    token: z.string().describe('Bearer token do usuário autenticado'),
    customFields: z.string().optional().describe('Campos extras do formulário em JSON string'),
  },
  async ({ sessionId, serviceId, locationId, token, customFields }) => {
    const parsed = customFields ? JSON.parse(customFields) : undefined;
    const result = await scheduleAppointment(
      { sessionId, serviceId, locationId, customFields: parsed },
      token
    );
    return { content: [{ type: 'text', text: result }] };
  }
);

server.tool(
  'check_ticket_status',
  'Consulta o status de um ticket pelo accessKey',
  { accessKey: z.string().describe('Chave de acesso do ticket') },
  async ({ accessKey }) => {
    const result = await checkTicketStatus(accessKey);
    return { content: [{ type: 'text', text: result }] };
  }
);

server.tool(
  'list_my_tickets',
  'Lista todos os tickets do usuário autenticado',
  { token: z.string().describe('Bearer token do usuário autenticado') },
  async ({ token }) => {
    const result = await listMyTickets(token);
    return { content: [{ type: 'text', text: result }] };
  }
);

// ─── RESOURCES ───────────────────────────────────────────

server.resource(
  'categories',
  'filazero://categories',
  { description: 'Categorias disponíveis na plataforma Filazero' },
  async () => ({
    contents: [{
      uri: 'filazero://categories',
      mimeType: 'application/json',
      text: resources.find(r => r.uri === 'filazero://categories')!.text,
    }],
  })
);

server.resource(
  'ticket-lifecycle',
  'filazero://ticket-lifecycle',
  { description: 'Estados possíveis de um ticket na plataforma Filazero' },
  async () => ({
    contents: [{
      uri: 'filazero://ticket-lifecycle',
      mimeType: 'application/json',
      text: resources.find(r => r.uri === 'filazero://ticket-lifecycle')!.text,
    }],
  })
);

server.resource(
  'scheduling-flow',
  'filazero://scheduling-flow',
  { description: 'Sequência correta de chamadas para realizar um agendamento' },
  async () => ({
    contents: [{
      uri: 'filazero://scheduling-flow',
      mimeType: 'application/json',
      text: resources.find(r => r.uri === 'filazero://scheduling-flow')!.text,
    }],
  })
);

// ─── PROMPTS ─────────────────────────────────────────────

server.prompt(
  'agendar-atendimento',
  'Fluxo completo para agendar um atendimento na Filazero',
  {
    empresa: z.string().optional().describe('Nome ou slug da empresa desejada'),
    servico: z.string().optional().describe('Nome do serviço desejado'),
  },
  async ({ empresa, servico }) => {
    const prompt = prompts.find(p => p.name === 'agendar-atendimento')!;
    let text = prompt.template;
    if (empresa) text += `\n\nEmpresa solicitada pelo usuário: ${empresa}`;
    if (servico) text += `\nServiço solicitado: ${servico}`;
    return {
      messages: [{ role: 'user' as const, content: { type: 'text' as const, text } }],
    };
  }
);

server.prompt(
  'consultar-agendamento',
  'Verificar o status de um ticket de agendamento',
  {
    accessKey: z.string().optional().describe('Chave de acesso do ticket'),
  },
  async ({ accessKey }) => {
    const prompt = prompts.find(p => p.name === 'consultar-agendamento')!;
    let text = prompt.template;
    if (accessKey) text += `\n\nChave do ticket: ${accessKey}`;
    return {
      messages: [{ role: 'user' as const, content: { type: 'text' as const, text } }],
    };
  }
);

// ─── START ────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('✅ Filazero MCP Server rodando...');
}

main().catch((err) => {
  console.error('❌ Erro ao iniciar servidor:', err);
  process.exit(1);
});
