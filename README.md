# Filazero MCP Server

Gateway inteligente sobre a API Filazero para agentes de IA.

## Pré-requisitos (instalar antes de tudo)

- [Node.js 22+](https://nodejs.org/en/download) — na tela de instalação, marque a opção "Add to PATH"
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — após instalar, abra o Docker Desktop antes de usar
- [Git](https://git-scm.com/download/win) — deixe todas as opções padrão na instalação

## Passo a passo para rodar

### 1. Clonar o repositório

Abra o **PowerShell** ou **Git Bash** e rode:
```bash
git clone https://github.com/LeonardoGentil/Residencia3.git
cd Residencia3
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Rodar em modo desenvolvimento
```bash
npm run dev
```

Se aparecer `✅ Filazero MCP Server rodando...` está funcionando!

### 4. Rodar com Docker

Certifique-se que o **Docker Desktop está aberto e rodando**, depois:
```bash
docker compose up
```

Se aparecer `✅ Filazero MCP Server rodando...` está funcionando!

## Testar com MCP Inspector

Com o servidor rodando, abra outro terminal e rode:
```bash
npx @modelcontextprotocol/inspector
```

Vai abrir uma URL no terminal. Acesse ela no navegador.

Configure assim:
- **Transport**: STDIO
- **Command**: npx
- **Arguments**: tsx src/index.ts
- Clique em **Connect**

Depois clique em **Tools → List Tools** para ver as tools disponíveis.

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

1. `list_companies` → lista empresas disponíveis
2. `get_company_services` → serviços da empresa escolhida
3. `get_available_dates` → dias com vagas no mês
4. `get_available_sessions` → horários disponíveis no dia
5. `get_booking_form` → campos do formulário
6. `schedule_appointment` → emite o ticket
7. `check_ticket_status` → confirma o agendamento

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
```
FILAZERO_API_URL=https://api.staging.filazero.net
FILAZERO_APP_ORIGIN=https://app.filazero.net
MCP_SERVER_PORT=3000
RATE_LIMIT_RPM=30
CACHE_TTL_COMPANIES=300
LOG_LEVEL=info
```



## Verificar se está tudo funcionando

### Teste rápido via terminal

Com o servidor rodando (`npm run dev`), abra outro terminal e rode:
```bash
npx @modelcontextprotocol/inspector
```

Acesse a URL que aparecer no navegador e siga os passos:

1. **Transport**: STDIO
2. **Command**: npx
3. **Arguments**: tsx src/index.ts
4. Clique em **Connect**
5. Deve aparecer **Connected** e **filazero-mcp Version: 1.0.0** no canto esquerdo

### Testar a API de verdade

1. Clique na aba **Tools**
2. Clique em **List Tools** — devem aparecer 8 tools
3. Clique em **list_companies**
4. Clique em **Run Tool**
5. Deve retornar uma lista de empresas em JSON

Se retornou empresas = **tudo funcionando!** ✅

### Testar os Resources

1. Clique na aba **Resources**
2. Clique em **List Resources**
3. Devem aparecer 3 resources:
   - `filazero://categories`
   - `filazero://ticket-lifecycle`
   - `filazero://scheduling-flow`

### Testar os Prompts

1. Clique na aba **Prompts**
2. Clique em **List Prompts**
3. Devem aparecer 2 prompts:
   - `agendar-atendimento`
   - `consultar-agendamento`

## Problemas comuns

**Erro: `npm` não encontrado**
→ Reinstale o Node.js e marque a opção "Add to PATH"

**Erro: `docker compose` não encontrado**
→ Abra o Docker Desktop e aguarde ele iniciar completamente

**Erro: `tsx` não encontrado**
→ Rode `npm install` novamente na pasta do projeto

**Porta já em uso**
→ Mude o valor de `MCP_SERVER_PORT` no arquivo `.env`
