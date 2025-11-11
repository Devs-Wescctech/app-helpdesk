# 🎫 IT Helpdesk System

Sistema completo de Helpdesk para TI com gestão de chamados, projetos Kanban, SLA configurável e dashboard analítico em tempo real.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13%2B-blue.svg)

## ✨ Funcionalidades

### 📋 Gestão de Chamados
- Sistema completo de tickets com workflow (Aberto → Em Atendimento → Aguardando → Resolvido → Fechado)
- 4 níveis de prioridade (Crítico, Alto, Médio, Baixo)
- Atribuição de técnicos responsáveis
- Sistema de comentários threaded
- Cálculo automático de SLA com alertas de vencimento
- Filtros avançados por status, prioridade e técnico

### 📊 Dashboard Analítico
- Métricas em tempo real:
  - Total de chamados ativos
  - TMA (Tempo Médio de Atendimento)
  - Taxa de Resolução
  - Nível de Serviço (SLA compliance)
- Gráficos e visualizações interativas
- Tendências e análises históricas

### 📁 Gestão de Projetos Kanban
- Criação e gerenciamento de projetos
- Sistema de tarefas com drag-and-drop
- Atribuição de membros da equipe
- Status de projeto (Planejamento, Em Progresso, Revisão, Concluído)
- Visualização Kanban interativa

### 👥 Gestão de Usuários
- Sistema de roles (Admin, Técnico, Usuário)
- Departamentos e informações de contato
- Estatísticas de chamados por usuário
- Perfis de usuário completos

### ⚙️ SLA Configurável
- Templates de SLA personalizáveis
- Configuração de tempos por prioridade
- CRUD completo de templates
- Cálculo automático de deadlines
- Alertas visuais de vencimento

### 🔔 Notificações em Tempo Real
- WebSocket para updates instantâneos
- Eventos para todas as entidades (tickets, projetos, tarefas, comentários)
- Invalidação automática de cache
- Sincronização em tempo real entre usuários

## 🏗️ Arquitetura

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Roteamento**: Wouter
- **UI Components**: shadcn/ui (Radix UI)
- **Estilo**: Tailwind CSS
- **Estado**: TanStack Query (React Query)
- **Forms**: react-hook-form + Zod
- **Design**: Linear-inspired minimalist UI

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL 13+
- **ORM**: Drizzle ORM
- **Auth**: OpenID Connect (OIDC)
- **Real-time**: WebSocket (ws)
- **Session**: express-session + connect-pg-simple

### Database Schema
- **Users**: Contas com roles e departamentos
- **Tickets**: Chamados com status, prioridade e SLA
- **Projects**: Projetos com Kanban
- **Tasks**: Tarefas dos projetos
- **Comments**: Comentários dos chamados
- **SLA Templates**: Templates de SLA configuráveis

## 🚀 Deployment

### Pré-requisitos
- Docker e Docker Compose
- PostgreSQL 13+ (externo ao Docker)
- Node.js 20+ (apenas para desenvolvimento)
- Git

### Instalação Rápida

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/helpdesk-system.git
cd helpdesk-system
```

2. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
nano .env
```

3. **Configure o banco de dados PostgreSQL**
```bash
sudo -u postgres psql
CREATE DATABASE helpdesk;
CREATE USER helpdesk_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE helpdesk TO helpdesk_user;
```

4. **Execute as migrations**
```bash
npm install
npm run db:push
```

5. **Build e inicie com Docker**
```bash
docker-compose up -d
```

6. **Acesse a aplicação**
```
http://localhost:5000
```

📚 **Documentação completa**: Veja [DEPLOY.md](DEPLOY.md) para instruções detalhadas de deployment.

## 🛠️ Desenvolvimento

### Instalar dependências
```bash
npm install
```

### Executar em modo desenvolvimento
```bash
npm run dev
```

### Build de produção
```bash
npm run build
```

### Executar migrations
```bash
npm run db:push
```

## 📝 Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `NODE_ENV` | Ambiente (development/production) | Sim |
| `PORT` | Porta da aplicação (padrão: 5000) | Não |
| `DATABASE_URL` | String de conexão PostgreSQL | Sim |
| `SESSION_SECRET` | Chave secreta para sessões | Sim |
| `ISSUER_URL` | URL do provedor OIDC | Condicional |
| `CLIENT_ID` | Client ID OAuth | Condicional |
| `CLIENT_SECRET` | Client Secret OAuth | Condicional |
| `APP_URL` | URL pública da aplicação | Sim |

## 🔐 Segurança

- ✅ Autenticação via OpenID Connect (OIDC)
- ✅ Sessões seguras com HTTP-only cookies
- ✅ Criptografia de senhas
- ✅ Proteção contra CSRF
- ✅ Sanitização de inputs
- ✅ Validação com Zod em todas as APIs
- ✅ Role-based access control (RBAC)

## 📊 Performance

- ✅ Multi-stage Docker build (imagem otimizada)
- ✅ Cache inteligente com TanStack Query
- ✅ Lazy loading de componentes
- ✅ Conexões WebSocket eficientes
- ✅ Índices otimizados no banco de dados
- ✅ Compressão de assets

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📦 Scripts Disponíveis

```bash
npm run dev          # Inicia desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia produção
npm run db:push      # Executa migrations
npm run db:studio    # Abre Drizzle Studio
npm run lint         # Executa linter
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para otimizar a gestão de suporte em TI.

## 🙏 Agradecimentos

- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI incríveis
- [Drizzle ORM](https://orm.drizzle.team/) - ORM TypeScript-first
- [TanStack Query](https://tanstack.com/query) - Gerenciamento de estado assíncrono
- [Radix UI](https://www.radix-ui.com/) - Primitivos UI acessíveis

## 📞 Suporte

Para reportar bugs ou solicitar features, abra uma [issue](https://github.com/seu-usuario/helpdesk-system/issues).

---

**Status do Projeto**: ✅ Produção Ready

**Última Atualização**: Novembro 2025
