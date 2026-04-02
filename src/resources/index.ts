export const resources = [
  {
    uri: 'filazero://categories',
    name: 'Categorias de Serviços',
    description: 'Categorias disponíveis na plataforma Filazero',
    mimeType: 'application/json',
    text: JSON.stringify({
      categories: [
        { id: 1, name: 'Saúde', description: 'Consultas e exames médicos' },
        { id: 2, name: 'Beleza', description: 'Salões e barbearias' },
        { id: 3, name: 'Serviços Públicos', description: 'Atendimentos governamentais' },
        { id: 4, name: 'Educação', description: 'Secretarias e atendimentos acadêmicos' },
      ],
    }),
  },
  {
    uri: 'filazero://ticket-lifecycle',
    name: 'Ciclo de Vida do Ticket',
    description: 'Estados possíveis de um ticket na plataforma Filazero',
    mimeType: 'application/json',
    text: JSON.stringify({
      states: [
        { state: 'PENDING', description: 'Ticket emitido, aguardando atendimento' },
        { state: 'IN_PROGRESS', description: 'Atendimento em andamento' },
        { state: 'COMPLETED', description: 'Atendimento concluído' },
        { state: 'CANCELLED', description: 'Ticket cancelado' },
        { state: 'NO_SHOW', description: 'Cliente não compareceu' },
      ],
    }),
  },
  {
    uri: 'filazero://scheduling-flow',
    name: 'Guia do Fluxo de Agendamento',
    description: 'Sequência correta de chamadas para realizar um agendamento',
    mimeType: 'application/json',
    text: JSON.stringify({
      steps: [
        { step: 1, tool: 'list_companies', description: 'Listar empresas disponíveis' },
        { step: 2, tool: 'get_company_services', description: 'Buscar serviços da empresa escolhida' },
        { step: 3, tool: 'get_available_dates', description: 'Verificar dias com vagas no mês' },
        { step: 4, tool: 'get_available_sessions', description: 'Buscar horários do dia escolhido' },
        { step: 5, tool: 'get_booking_form', description: 'Buscar campos do formulário' },
        { step: 6, tool: 'schedule_appointment', description: 'Emitir o ticket de agendamento' },
        { step: 7, tool: 'check_ticket_status', description: 'Verificar status do ticket emitido' },
      ],
      rules: [
        'Sempre use abstractServiceId quando disponível e maior que zero',
        'Datas são em UTC — exibir convertido para America/Sao_Paulo',
        'A API retorna HTTP 200 mesmo em erros — verificar campo messages',
      ],
    }),
  },
];
