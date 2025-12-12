# WhatsApp SaaS - Plataforma Completa de Atendimento

SaaS completo para gerenciamento de atendimento via WhatsApp com múltiplas instâncias, chat em tempo real e dashboard de métricas.

## Estrutura do Projeto

Este projeto está dividido em duas partes principais:

### Frontend (Next.js - Vercel)
- Autenticação com Supabase Auth
- Dashboard com métricas diárias
- Gerenciamento de instâncias WhatsApp
- Chat em tempo real com Socket.IO
- Interface responsiva e moderna

### Backend (Node.js + Express - Railway)
- API REST para gerenciamento
- Integração com whatsapp-web.js
- WebSocket com Socket.IO
- Gerenciamento de múltiplas instâncias
- Webhook para vendas

## Tecnologias Utilizadas

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase (Auth + Database)
- Socket.IO Client
- shadcn/ui

### Backend
- Node.js
- Express
- whatsapp-web.js
- Socket.IO
- Supabase (Database)
- TypeScript

## Setup do Projeto

### 1. Configurar Banco de Dados (Supabase)

Os scripts SQL estão em `/scripts`:

\`\`\`bash
# Execute os scripts na ordem:
001_create_users_and_projects.sql
002_create_whatsapp_instances.sql
003_create_contacts.sql
004_create_messages.sql
005_create_sales_events.sql
\`\`\`

### 2. Frontend (Next.js)

\`\`\`bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
# As variáveis do Supabase já estão configuradas no projeto v0

# Adicionar variável do backend
NEXT_PUBLIC_BACKEND_URL=https://seu-backend.railway.app
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Deploy no Vercel
# Conecte o repositório no Vercel e faça o deploy
\`\`\`

### 3. Backend (Node.js)

\`\`\`bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente (.env)
SUPABASE_URL=seu_supabase_url
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
FRONTEND_URL=https://seu-frontend.vercel.app
PORT=3001
NODE_ENV=production

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start
\`\`\`

### 4. Deploy Backend no Railway

1. Crie um novo projeto no Railway
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente no Railway
4. O Railway detectará automaticamente o Node.js e fará o deploy

## Arquitetura

### Fluxo de Dados

1. **Autenticação**: Usuário faz login via Supabase Auth
2. **Projetos**: Usuário cria projetos (multi-tenant)
3. **Instâncias**: Usuário cria instâncias WhatsApp por projeto
4. **Conexão**: Backend inicia whatsapp-web.js e gera QR code
5. **Socket.IO**: Frontend recebe QR code e status em tempo real
6. **Mensagens**: Mensagens recebidas são salvas no banco e enviadas via Socket.IO
7. **Chat**: Frontend exibe mensagens em tempo real e permite envio

### Segurança

- Row Level Security (RLS) no Supabase
- JWT tokens para autenticação na API
- Validação de propriedade em todas as operações
- CORS configurado corretamente

## Funcionalidades

### Dashboard
- Taxa de resposta do dia (%)
- Mensagens recebidas no dia
- Contatos únicos do dia
- Vendas do dia (via webhook)

### Instâncias
- Criar múltiplas instâncias
- Conectar via QR code
- Visualizar status (Conectado, Desconectado, etc)
- Gerenciar instâncias por projeto

### Chat
- Lista de contatos com última mensagem
- Histórico completo de mensagens
- Envio de mensagens em tempo real
- Atualização automática via Socket.IO

### Webhook de Vendas
\`\`\`bash
POST /api/webhooks/sales
{
  "sale_id": "123",
  "amount": 100.50,
  "currency": "BRL",
  "status": "PAID",
  "project_external_id": "seu_projeto"
}
\`\`\`

## Próximos Passos

1. Adicionar suporte para mídias (imagens, áudio, vídeo)
2. Implementar respostas automáticas
3. Adicionar tags e categorias para contatos
4. Dashboard com gráficos históricos
5. Exportação de relatórios
6. Notificações push

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

## Licença

MIT
