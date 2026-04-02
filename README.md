# Filazero MCP Server

Gateway inteligente sobre a API Filazero para agentes de IA.

## Requisitos

- Node.js 22+
- Docker + Docker Compose

## Instalação e execução

### Modo desenvolvimento
```bash
npm install
npm run dev
```

### Modo Docker
```bash
docker compose up
```

## Variáveis de ambiente

| Variável | Default | Descrição |
|---|---|---|
| FILAZERO_API_URL | https://api.staging.filazero.net | URL base da API |
| FILAZERO_APP_ORIGIN | https://app.filazero.net | Origin para headers |
| MCP_SERVER_PORT | 3000 | Porta do servidor |
| RATE_LIMIT_RPM | 30 | Requisições/min |
| CACHE_TTL_COMPANIES | 300 | TTL cache em segundos |
| LOG_LEVEL | info | Nível de log |

## Tools disponíveis

| Tool | Descrição | Auth |
|---|---|---|
| list_companies | Lista empresas disponíveis | Pública |
| get_company_services | Serviços de uma empresa | Pública |
| get_available_dates | Dias com vagas no mês | Pública |
| get_available_sessions | Horários e profissionais | Pública |
| get_booking_form | Campos do formulário | Pública |
| schedule_appointment | Emite ticket de agendamento | Bearer Token |
| check_ticket_status | Consulta status do ticket | Pública |
| list_my_tickets | Lista tickets do usuário | Bearer Token |

## Fluxo de agendamento

1. `list_companies` → lista empresas
2. `get_company_services` → serviços da empresa
3. `get_available_dates` → dias disponíveis
4. `get_available_sessions` → horários do dia
5. `get_booking_form` → campos do formulário
6. `schedule_appointment` → emite o ticket
7. `check_ticket_status` → confirma o agendamento

## Conectar ao Claude Desktop

Adicione ao arquivo `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "filazero": {
      "command": "npx",
      "args": ["tsx", "/caminho/para/filazero-mcp/src/index.ts"]
    }
  }
}
```

## Testar com MCP Inspector
```bash
npx @modelcontextprotocol/inspector
```
