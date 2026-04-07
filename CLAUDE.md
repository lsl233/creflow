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

TanStack Start supports server functions via `createServerFn`:

```tsx
import { createServerFn } from '@tanstack/react-start'

const getData = createServerFn({ method: 'GET' })
  .handler(async () => { /* server code */ })
```

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

- Both backend and web default to port 3000; change one when running simultaneously
- Backend uses ES modules (`"type": "module"`)
- Web app uses TypeScript strict mode with verbatim module syntax
- Route files use `createFileRoute` from `@tanstack/react-router`
- CSS imports use `?url` suffix: `import appCss from '../styles.css?url'`
