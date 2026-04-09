# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Creflow is an AI content operations product (AI运营产品) for social media management. It's a pnpm monorepo with:

- `apps/backend`: Hono-based Node.js API server
- `apps/web`: TanStack Start React frontend

## Common Commands

### Root Level (runs all packages)

```bash
pnpm dev          # Start both backend and web dev servers in parallel
pnpm build        # Build all packages
pnpm lint         # Run linting in all packages
pnpm clean        # Clean build artifacts in all packages
```

### Backend (`apps/backend`)

```bash
pnpm dev          # Start dev server with hot reload (tsx watch) on port 3000
pnpm build        # Compile TypeScript to dist/
pnpm start        # Run compiled dist/index.js
pnpm clean        # Remove dist/
```

### Web (`apps/web`)

```bash
pnpm dev          # Start Vite dev server on port 3000
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run Vitest tests
pnpm clean        # Remove dist/ and .output/
```

## Architecture

### Monorepo Structure

- Uses pnpm workspaces defined in `pnpm-workspace.yaml`
- Packages: `apps/*` and `packages/*`
- Package names use `@creflow/` prefix (e.g., `@creflow/backend`, `@creflow/web`)

### Shared Packages

#### `@creflow/config` - Configuration Management

Centralized configuration management with Zod validation:

```
packages/config/
├── src/schema.ts     # Zod schemas for server/client config
├── src/server.ts     # Server-side config (contains secrets)
└── src/index.ts      # Client-safe config
```

**Usage:**
```typescript
// Server-side code only
import { getServerConfig } from '@creflow/config/server'
const config = getServerConfig()
// config.MINIMAX_API_KEY, config.MINIMAX_MODEL, etc.
```

Configuration is loaded from root `.env` file.

#### `@creflow/ai` - AI Client Package

Reusable AI functionality used by both backend and web:

```
packages/ai/
├── src/client.ts          # MiniMaxClient wrapper
├── src/types.ts           # TypeScript interfaces
├── src/prompts/           # Prompt templates
│   ├── content-plan.ts
│   └── generate-post.ts
└── src/index.ts           # High-level functions
```

**Usage:**
```typescript
// High-level functions (auto-loads config)
import { generateContentPlan, generatePost } from '@creflow/ai'

const { data, fallback } = await generateContentPlan({
  niche: '美妆',
  goal: '涨粉',
  persona: '真实'
})
```

**Architecture Flow:**
```
┌─────────────────────────────────────────────────────┐
│                    packages/ai                       │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   client.ts  │  │  prompts/    │  │  types.ts │ │
│  │ MiniMaxClient│  │  templates   │  │  shared   │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
┌───────────────┐            ┌───────────────┐
│   apps/web    │            │ apps/backend  │
│               │            │               │
│  server fn    │            │  API routes   │
│  (direct)     │            │  (HTTP)       │
└───────────────┘            └───────────────┘
```

### Backend (`apps/backend`)

- **Framework**: Hono with `@hono/node-server`
- **Entry**: `src/index.ts`
- **Dev Tool**: `tsx watch` for hot reload during development
- **Build Output**: `dist/index.js`

### Frontend (`apps/web`)

- **Framework**: TanStack Start (full-stack React framework)
- **Router**: TanStack Router with file-based routing
- **Build Tool**: Vite with `@tanstack/react-start/plugin/vite`
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Testing**: Vitest

#### File-Based Routing

Routes are defined as files in `src/routes/`:

- `src/routes/__root.tsx` - Root layout (shellComponent) wraps all routes
- `src/routes/index.tsx` - Home page ("/")
- `src/routes/about.tsx` - About page ("/about")
- `src/routes/blog.$postId.tsx` - Dynamic route ("/blog/:postId")

Route tree is auto-generated at `src/routeTree.gen.ts`.

#### Key Configuration Files

- `vite.config.ts` - Vite plugins: devtools, tsconfigPaths, tailwindcss, tanstackStart, viteReact
- `tsconfig.json` - Path aliases: `#/*` maps to `./src/*`
- `router.tsx` - Router configuration with `getRouter()` function

#### Path Aliases

Use `#/` prefix for imports from src:

```tsx
import Header from '#/components/Header'
import { getRouter } from '#/router'
```

#### Server Functions

We use TanStack Start's `createServerFn` to call AI services directly from the frontend without going through the backend API:

```tsx
import { createServerFn } from '@tanstack/react-start'
import { generateContentPlan } from '@creflow/ai'

export const generateContentPlanFn = createServerFn({ method: 'POST' })
  .handler(async ({ data }) => {
    return generateContentPlan(data)
  })
```

Usage in components:
```tsx
import { generateContentPlanFn } from '@/functions/content'

const result = await generateContentPlanFn({ data: { niche: '美妆' } })
```

This provides:
- Direct AI access without HTTP overhead
- Type-safe API calls
- Automatic server-side rendering support

#### Data Loading

Use route loaders for data fetching:

```tsx
export const Route = createFileRoute('/posts')({
  loader: async () => {
    const response = await fetch('/api/posts')
    return response.json()
  },
  component: PostsComponent,
})
```

Access loader data with `Route.useLoaderData()`.

## Development Notes

### Environment Configuration

All environment variables are managed from the root `.env` file:

```bash
# AI Configuration
MINIMAX_API_KEY=your-api-key-here
MINIMAX_BASE_URL=https://api.minimaxi.chat/v1
MINIMAX_MODEL=MiniMax-Text-01

# Server Configuration
PORT=3001
NODE_ENV=development
```

The `packages/config` package automatically loads these values using `dotenv`.

### Port Configuration

- Backend: Port 3001 (configurable via `PORT` env var)
- Web: Port 3000 (Vite dev server)
- Run both simultaneously with `pnpm dev` from root

### Build Order

When building from scratch, build shared packages first:

```bash
# 1. Build shared packages
cd packages/config && pnpm build
cd packages/ai && pnpm build

# 2. Build apps
cd apps/backend && pnpm build
cd apps/web && pnpm build
```

### TypeScript Import Paths

- Backend: Standard relative imports (`./routes/content-plan.js`)
- Web: Use `@/` prefix for src imports (`@/components/ui/button`)
- Shared packages: Full package name (`@creflow/ai`, `@creflow/config/server`)

### ES Modules

- All packages use `"type": "module"`
- Import paths must include `.js` extension for TypeScript output
- `tsx` handles TypeScript execution in development

### CSS Imports

Use `?url` suffix for CSS imports in route files:

```tsx
import appCss from '../styles.css?url'
```
