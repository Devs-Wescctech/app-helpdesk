# Helpdesk System

## Overview

A comprehensive IT helpdesk and support management system built with a modern full-stack architecture. The application provides ticket management, project tracking with Kanban boards, user management, and real-time dashboard analytics. Designed for IT support teams to efficiently handle support requests, track SLA compliance, and manage technical projects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server

**UI Component System**: 
- shadcn/ui component library (Radix UI primitives)
- Tailwind CSS for styling with custom design tokens
- Linear-inspired minimalist design system emphasizing efficiency and clean data hierarchy
- Custom theme system supporting light/dark modes via ThemeProvider
- Typography: Inter for UI text, JetBrains Mono for technical elements (ticket IDs, codes)

**State Management**:
- TanStack Query (React Query) for server state management
- Custom hooks for authentication (`useAuth`) and WebSocket connections (`useWebSocket`)
- No global client state management - relies on server state synchronization

**Routing**: 
- wouter for client-side routing
- Route-based authentication with landing page for unauthenticated users
- Protected routes requiring authentication

**Key Pages**:
- Dashboard: Analytics and metrics overview
- Tickets: Support ticket management with list/grid views
- Projects: Kanban-style project and task management
- Users: User directory and management
- Landing: Public-facing login page

### Backend Architecture

**Runtime**: Node.js with Express.js framework

**API Design**: RESTful API endpoints under `/api` prefix
- Authentication endpoints (`/api/auth/user`, `/api/login`)
- Resource endpoints for tickets, projects, users, SLA templates
- Real-time updates via WebSocket connections on `/ws` path

**Authentication & Session Management**:
- OpenID Connect (OIDC) integration with Replit authentication
- Passport.js strategy for OIDC flows
- PostgreSQL-backed session storage using `connect-pg-simple`
- Session-based authentication with secure HTTP-only cookies

**Real-time Communication**:
- WebSocket server for live updates
- Event-based message system for ticket, project, and task changes
- Automatic query invalidation on the client when events are received
- Heartbeat mechanism to maintain active connections

**Data Access Layer**:
- Storage abstraction pattern (`storage.ts` interface)
- Centralized database operations through storage methods
- Support for CRUD operations on all entities

### Database Schema

**ORM**: Drizzle ORM with PostgreSQL dialect

**Core Tables**:
- `sessions`: OpenID Connect session storage
- `users`: User accounts with roles (admin, technician, user), departments, and profile info
- `tickets`: Support tickets with status tracking, priority levels, SLA monitoring, and assignee relationships
- `ticket_comments`: Threaded comments on tickets
- `sla_templates`: Service Level Agreement templates defining response and resolution times by priority
- `projects`: Project records with status, dates, and descriptions
- `project_tasks`: Individual tasks within projects with status and assignee tracking
- `project_members`: Many-to-many relationship between users and projects

**Enums**:
- User roles: admin, technician, user
- Ticket status: open, in_progress, waiting, resolved, closed
- Priority levels: critical, high, medium, low
- Project status: planning, in_progress, review, completed

**Database Provider**: Neon serverless PostgreSQL with WebSocket connection pooling

### Build & Deployment

**Development Mode**:
- Vite dev server with HMR for frontend
- tsx for running TypeScript server code with hot reload
- Concurrent frontend and backend development

**Production Build**:
- Vite builds client bundle to `dist/public`
- esbuild bundles server code to `dist/index.js`
- Single production server serves both API and static assets
- Static asset serving in production mode

**Configuration**:
- Environment-based configuration (development vs production)
- Database URL via environment variable
- Session secrets for authentication
- OIDC issuer URL configuration

## External Dependencies

**Database**: 
- Neon serverless PostgreSQL (via `@neondatabase/serverless`)
- WebSocket-based connection pooling
- Requires `DATABASE_URL` environment variable

**Authentication Service**:
- Replit OIDC provider for user authentication
- Requires `ISSUER_URL`, `REPL_ID`, and `SESSION_SECRET` environment variables
- OpenID Connect discovery for dynamic configuration

**UI Component Library**:
- Radix UI primitives for accessible components
- Google Fonts CDN for Inter and JetBrains Mono fonts

**Development Tools**:
- Replit-specific Vite plugins (cartographer, dev-banner, runtime error overlay)
- Only loaded in Replit development environment

**Key NPM Packages**:
- Form handling: react-hook-form with zod validation
- Date utilities: date-fns with Portuguese locale
- WebSocket: ws library for server-side WebSocket implementation
- Session management: express-session with connect-pg-simple
- Real-time queries: TanStack Query for automatic cache invalidation