# Prompts de Design — Projeto 14: Mini SaaS de Clientes Single-Tenant (ClientPulse SaaS)

Documento de especificações de prompts para geração de referências visuais em modelos de IA generativa (Midjourney v6, FLUX.1 Pro, DALL-E 3, Ideogram).

---

## 🎯 Conceito & Direção Visual

- **Nicho:** Gestão de Clientes B2B, Projetos e Faturamento para Agências & Consultorias (Single-Tenant SaaS).
- **Estilo:** Modern B2B SaaS Dashboard, Clean Dark Mode com toques de Electric Indigo (`#6366F1`) e Emerald (`#10B981`).
- **Paleta de Cores:** Fundo Dark Slate / Charcoal (`#090D16`, `#111827`), Cards com bordas refinadas de 1px (`#1F2937`), Tipografia *Plus Jakarta Sans* / *Inter*.
- **Estrutura:** Sidebar lateral de navegação retrátil (Dashboard, Clients, Projects, Invoices, Settings), Topbar com busca global e perfil, 4 KPI cards superiores, Gráfico de Receita Recorrente (MRR) e Tabela analítica de clientes recentes.

---

## 🖼️ Prompt 1: Visão Geral do Dashboard Executivo (Main SaaS Screen — Midjourney / FLUX)

```text
Ultra-modern B2B single-tenant client management SaaS dashboard interface called "ClientPulse", clean dark mode aesthetic with deep midnight slate background (#090D16) and subtle 1px border cards. Left sidebar navigation with sleek brand logo, active navigation pills (Dashboard, Clients, Projects, Invoices, Settings), and user profile at the bottom. Top header with global search bar, quick "+ New Client" CTA button in electric indigo (#6366F1), and notifications icon. Upper dashboard area features 4 executive KPI metric cards: Monthly Recurring Revenue ($24,850 with +18.4% green badge), Active Clients (42), Open Projects (18), and Unpaid Invoices ($4,200). Central area displays a compound financial chart showing monthly billing trajectory with glowing violet and emerald area fills, next to a projects status donut ring. Lower section features a clean data table with recent client accounts, status badges (Active, Onboarding, Paused), avatar initials, and action buttons. Pixel-perfect UI/UX, Figma presentation style, Dribbble trending, Behance featured, 8k resolution, crisp vector rendering, desktop UI screenshot --ar 16:9 --v 6.0 --style raw
```

---

## 🖼️ Prompt 2: Módulo de Clientes & Projetos (Client Profile & Invoices Detail View)

```text
Modern B2B client detail and billing management web application screen, dark theme UI with sleek indigo and mint green accents. Left side shows client profile card (Company name "Acme Media Corp", primary contact, phone, email, and contract value $48,000/yr). Center panel shows active client projects with deadline countdown progress bars and allocated budget meters. Right panel shows recent invoices table with status pills (Paid in glowing emerald, Pending in warm amber) and "Download PDF Invoice" button. Ultra-crisp typography, dense tabular layout, modern minimalist SaaS aesthetic, Figma UI kit, 8k, photorealistic desktop mockup --ar 16:9 --v 6.0
```

---

## 📋 Como utilizar:
1. Copie qualquer um dos prompts acima no Midjourney (`/imagine`), FLUX.1 Pro ou DALL-E 3.
2. Salve a imagem gerada em alta definição dentro de `14-mini-saas/design/` com o nome `design_completo.png` ou `design.png`.
