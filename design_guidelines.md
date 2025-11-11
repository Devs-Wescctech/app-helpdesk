# Design Guidelines: Sistema de Helpdesk para Suporte de TI

## Design Approach
**Design System:** Linear-inspired minimalism + Asana's board management + enterprise dashboard patterns
**Justification:** Utility-focused productivity tool requiring efficiency, data clarity, and professional aesthetics for IT support teams.

## Core Design Principles
1. **Information Hierarchy:** Clear visual distinction between primary actions, data, and metadata
2. **Efficiency First:** Minimize clicks, maximize visibility of critical information
3. **Consistent Patterns:** Reusable components across tickets, projects, and dashboards
4. **Professional Polish:** Clean, modern interface that conveys reliability and competence

## Typography

**Font Family:** 
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for ticket IDs, codes)

**Hierarchy:**
- Page Titles: text-2xl font-semibold (24px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-lg font-medium (18px)
- Body Text: text-base (16px)
- Meta/Labels: text-sm font-medium (14px)
- Captions: text-xs text-gray-600 (12px)

## Layout System

**Spacing Primitives:** Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16
- Tight spacing: p-2, gap-1 (components, inline elements)
- Standard spacing: p-4, gap-4 (cards, form fields)
- Section spacing: p-6, p-8 (page sections, modals)

**Grid System:**
- Main Layout: Sidebar (256px fixed) + Main Content (flex-1)
- Dashboard: 12-column responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Kanban Columns: Equal-width flex columns with min-width-80

## Component Library

### Navigation
**Sidebar (Fixa):**
- Logo/Brand (h-16)
- Primary navigation items com ícones (Heroicons)
- User profile footer com foto/nome/role
- Collapse/expand functionality
- Active state: subtle background com border-left accent

**Top Bar:**
- Breadcrumbs navigation
- Global search (prominent)
- Notifications bell com badge counter
- User avatar dropdown

### Dashboards & Analytics
**Metric Cards:**
- Large number display (text-3xl font-bold)
- Label below (text-sm)
- Trend indicator (arrow + percentage)
- Compact size: p-6, rounded-lg border

**Charts:**
- Use Chart.js or Recharts library
- Minimal grid lines
- Clear legends
- Tooltips on hover
- Consistent color-blind friendly palette

**Tables:**
- Striped rows (subtle)
- Sortable headers com ícone
- Sticky header on scroll
- Row hover states
- Pagination controls

### Gestão de Chamados

**Formulário de Abertura:**
- Multi-step layout (3 steps: Detalhes → Classificação → Revisão)
- Progress indicator no topo
- Large textarea for description
- File upload dropzone
- Priority/Category selectors com visual indicators
- Submit button: large, prominent

**Kanban Board:**
- Columns: horizontal scroll se necessário
- Cards: compact (p-4), rounded, shadow-sm
- Ticket ID em monospace no topo
- Priority badge (cor-coded)
- Assignee avatar (small, 24px)
- Drag handles visíveis on hover
- Add card button em cada coluna

**Vista Lista:**
- Tabela com colunas: ID, Título, Status, Prioridade, Técnico, SLA, Criado
- Filtros no topo (Status, Prioridade, Técnico)
- Bulk actions checkbox
- Quick actions menu (três pontos)

### Gestão de Projetos (Trello-style)

**Board View:**
- Similar ao Kanban de tickets
- Project cards com thumbnail/icon
- Team members avatars (stacked)
- Progress bar (% completion)
- Quick add modal

**Projeto Individual:**
- Header: Nome, descrição, team, dates
- Task list com checkboxes
- Assignee + due date por task
- Comments section

### Formulários & Inputs

**Text Inputs:**
- Height: h-10
- Padding: px-3
- Border: border rounded
- Focus: ring-2 ring-blue-500

**Selects & Dropdowns:**
- Custom styled (evite select nativo)
- Search dentro de dropdowns longos
- Multi-select com chips

**Buttons:**
- Primary: px-4 py-2, rounded, font-medium
- Secondary: outlined version
- Danger: vermelho para ações destrutivas
- Icon buttons: p-2, rounded (actions)

### Status & Badges

**Priority Indicators:**
- Crítico: Borda vermelha, background vermelho suave
- Alto: Laranja
- Médio: Amarelo
- Baixo: Cinza

**Status Badges:**
- Pill-shaped (rounded-full px-3 py-1)
- Text: text-xs font-medium
- Cores semânticas: verde (resolvido), azul (em atendimento), amarelo (aguardando)

### SLA Visual Indicators
- Progress rings ou bars
- Countdown timers para SLAs críticos
- Warning states (amarelo quando <20% tempo restante)
- Breach indicators (vermelho quando ultrapassado)

## Icons
**Library:** Heroicons (via CDN - outline style para navegação, solid para status/actions)

## Animations
**Minimal & Purposeful:**
- Page transitions: none (instant)
- Modal/dropdown open: scale + fade (150ms)
- Drag-and-drop: subtle lift shadow
- Loading states: spinner ou skeleton screens
- NO scroll-triggered animations

## Accessibility
- Keyboard navigation em todos componentes
- Focus states visíveis (ring-2)
- ARIA labels em ícone-only buttons
- Contrast ratio mínimo 4.5:1
- Screen reader friendly table headers

## Images
No images needed - this is a data-driven enterprise application focused on functionality over visual storytelling.