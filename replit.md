# Ishana's Birthday

An interactive birthday experience for Ishana — a password-protected, multi-scene React app with a purple/lavender aesthetic.

## Stack

- **Frontend**: React + Vite + Tailwind CSS + Framer Motion (`artifacts/ishana-birthday`)
- **API Server**: Express 5 + Pino logging (`artifacts/api-server`)
- **Database layer**: Drizzle ORM + PostgreSQL (`lib/db`) — currently no tables defined; schema is ready to extend
- **Shared libraries**: `lib/api-zod` (Zod schemas), `lib/api-spec` (OpenAPI spec), `lib/api-client-react` (React Query client)
- **Package manager**: pnpm workspace

## Running the project

Workflows are pre-configured:
- **web** — `pnpm --filter @workspace/ishana-birthday run dev` (frontend, preview at `/`)
- **API Server** — `pnpm --filter @workspace/api-server run dev` (backend, preview at `/api`)

Install dependencies with `pnpm install` from the root.

## Environment variables

- `SESSION_SECRET` — required for session middleware
- `DATABASE_URL` — required if the database layer is used; provision a Replit PostgreSQL database to get one

## Scenes

The birthday app has 5 scenes:
1. **Password** — entry gate
2. **Cake Builder** — interactive cake
3. **Letter** — personal message
4. **Questions** — trivia/questions
5. **Final** — closing scene

Press `Shift+S` in dev to skip to the next scene.

## User preferences
