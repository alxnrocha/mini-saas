# Blueprint — Projeto 14: Mini SaaS de Clientes Single-Tenant (ClientPulse SaaS)

- **Nicho:** Gestão de Contas, Assinaturas, Faturamento e Projetos B2B (SaaS B2B Single-Tenant).
- **Repositório GitHub:** `https://github.com/alxnrocha/mini-saas` · **Pasta Local:** `14-mini-saas/`
- **Marco Técnico:** Primeiro projeto com **Next.js 16 (App Router + Server Actions)**, **PostgreSQL 17 em container Docker Compose**, **Prisma 6 ORM** e monitoramento **Sentry**.

---

## 🏛️ 1. Arquitetura & Estrutura de Pastas

```text
14-mini-saas/
├── src/
│   ├── app/                        # Next.js 16 App Router
│   │   ├── (auth)/                 # login, register, forgot-password
│   │   ├── (dashboard)/            # dashboard, clients, projects, invoices, settings
│   │   │   ├── layout.tsx          # Sidebar + Topbar do SaaS
│   │   │   ├── page.tsx            # Dashboard executivo com métricas MRR/ARR
│   │   │   ├── clients/            # Gestão e cadastro de clientes
│   │   │   ├── projects/           # Projetos e prazos
│   │   │   ├── invoices/           # Faturamento e status de pagamento
│   │   │   └── settings/           # Configurações de conta
│   │   ├── api/                    # Route handlers auxiliares
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/                 # Primitivas UI (shadcn-style) e componentes de negócio
│   │   ├── ui/                     # Button, Card, Badge, Dialog, Table, Input
│   │   ├── layout/                 # Sidebar, Header, Breadcrumbs
│   │   └── dashboard/              # MetricCards, RevenueChart, InvoicesTable
│   ├── lib/                        # prisma.ts, auth.ts, utils.ts
│   ├── server/                     # Server Actions (actions/clients.ts, actions/invoices.ts)
│   └── types/                      # Interfaces TypeScript
├── prisma/
│   ├── schema.prisma               # Schema PostgreSQL
│   └── seed.ts                     # População inicial de dados
├── design/
│   ├── PROMPTS.md                  # Prompts para Midjourney / FLUX
│   └── design_completo.png         # Referência visual externa
├── compose.yaml                    # Docker Compose (PostgreSQL 17)
├── .env.example
├── .github/workflows/ci.yml        # CI automatizado
├── BLUEPRINT.md
├── DECISIONS.md
├── README.md
└── STATUS_PROGRESSO.md             # Controle local (privado)
```

---

## 🗄️ 2. Modelo de Dados (Prisma 6 + PostgreSQL 17)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  passwordHash  String
  createdAt     DateTime  @default(now())
  clients       Client[]
}

model Client {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  companyName   String
  contactEmail  String
  phone         String?
  status        String    @default("active") // active, churned, lead
  createdAt     DateTime  @default(now())
  projects      Project[]
  invoices      Invoice[]
}

model Project {
  id            String    @id @default(cuid())
  clientId      String
  client        Client    @relation(fields: [clientId], references: [id], onDelete: Cascade)
  name          String
  budget        Decimal   @db.Decimal(10, 2)
  status        String    @default("in_progress") // planned, in_progress, completed, paused
  deadline      DateTime?
  createdAt     DateTime  @default(now())
}

model Invoice {
  id            String    @id @default(cuid())
  clientId      String
  client        Client    @relation(fields: [clientId], references: [id], onDelete: Cascade)
  amount        Decimal   @db.Decimal(10, 2)
  dueDate       DateTime
  status        String    @default("unpaid") // unpaid, paid, overdue, cancelled
  paidAt        DateTime?
  createdAt     DateTime  @default(now())
}
```

---

## 🗺️ 3. Fluxo Completo do Usuário (End-to-End)

```text
[ 1. Autenticação & Sessão ] ──► Login seguro / Dashboard Executivo
           │
           ▼
[ 2. Visão Geral / Métricas ] ─► MRR, Clientes Ativos, Invoices Pendentes e Gráfico de Receita
           │
           ▼
[ 3. Gestão de Clientes ]    ──► Cadastro, listagem com filtros, status e histórico de projetos
           │
           ▼
[ 4. Projetos & Prazos ]     ──► Acompanhamento de orçamento alocado e prazos de entrega
           │
           ▼
[ 5. Faturamento & Invoices ] ─► Emissão simulada, status de cobrança (Paid, Unpaid, Overdue) e recibos
```

---

## 📋 4. Roadmap de Issues (4 Milestones FORGE-DEV)

### 🪵 Milestone 1 — Project Foundation, Docker & Prisma
- **Issue #1:** Setup do projeto Next.js 16 + TypeScript + Tailwind CSS v4 + Oxlint + Vitest + Sentry.
- **Issue #2:** Configuração do Docker Compose (`compose.yaml` com PostgreSQL 17), schema Prisma (`schema.prisma`) e script de seed.

### 🪵 Milestone 2 — Auth & Shell do Dashboard
- **Issue #3:** Telas de autenticação (Login, Registro) e layout do Dashboard (Sidebar retrátil, Topbar e Breadcrumbs).
- **Issue #4:** Dashboard Executivo com KPI cards (MRR, Total Clients, Active Projects, Pending Revenue) e Gráfico de Faturamento.

### ⚙️ Milestone 3 — Módulos de Clientes, Projetos & Invoices
- **Issue #5:** Módulo de Clientes (CRUD via Server Actions, tabela analítica com busca e status).
- **Issue #6:** Módulo de Projetos (Alocação de orçamento, barra de progresso e prazos).
- **Issue #7:** Módulo de Invoices & Faturamento (Geração de fatura, filtros de vencimento e quitação).

### 🛡️ Milestone 4 — Qualidade, Acessibilidade & Documentação
- **Issue #8:** Suíte de testes unitários e de Server Actions com Vitest + Mock de Prisma.
- **Issue #9:** Auditoria de acessibilidade ARIA, navegação por teclado e responsividade mobile.
- **Issue #10:** Documentação técnica oficial em espanhol (`README.md`) com DER em Mermaid e instruções de Docker.
