# SahabatBarokahAI Workspace

## Overview

AI SaaS platform for Indonesian small businesses — generates Ramadan business strategies, viral menu ideas, marketing content, and profit analysis using AI. Built as a pnpm monorepo.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/sahabat-barokah)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **AI**: OpenAI GPT-5.2 via Replit AI Integrations
- **Auth**: JWT + bcryptjs (cookie + Authorization header)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── sahabat-barokah/    # React frontend (Ramadan-themed)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

- `users` — id, name, email, password_hash, plan (free/pro/business), role (user/admin), daily_usage, last_usage_date, created_at
- `generations` — id, user_id, tool (strategy/menu/profit/marketing), input (jsonb), result (text), created_at

## Auth

- JWT signed with `JWT_SECRET` env var (defaults to hardcoded dev key)
- Token stored in httpOnly cookie AND returned in response body
- Frontend stores token in localStorage for API calls
- Admin password: `password` (bcrypt hash of "password")
- Admin email: `admin@sahabatbarokah.id`

## AI Tools

1. **Strategy Generator** — Ramadan business strategy (businessType, targetMarket, budget)
2. **Viral Menu Generator** — Viral food menu ideas (foodType, targetCustomer, priceRange)
3. **Profit Calculator** — Profit analysis (productName, costPerItem, sellingPrice, estimatedDailySales)
4. **Marketing Content Generator** — Marketing content + captions (productName, promotionType, targetAudience)

## Subscription Plans

- Free: 5 AI generations/day
- Pro: Rp49.000/month — unlimited generations
- Business: Rp99.000/month — priority processing
- Payment via Mayar: https://mayar.to/alvin-the-chipmunk

## API Routes

All routes under `/api/`:
- `POST /auth/register` — Register
- `POST /auth/login` — Login
- `POST /auth/logout` — Logout
- `GET /auth/me` — Get current user
- `POST /ai/strategy` — Generate strategy
- `POST /ai/menu` — Generate menu
- `POST /ai/profit` — Generate profit analysis
- `POST /ai/marketing` — Generate marketing content
- `GET /history` — Get user history
- `DELETE /history/:id` — Delete history entry
- `GET /admin/stats` — Admin stats
- `GET /admin/users` — Admin user list
- `PATCH /admin/users/:id/plan` — Update user plan
- `GET /admin/analytics` — Analytics data

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — OpenAI proxy base URL
- `AI_INTEGRATIONS_OPENAI_API_KEY` — OpenAI proxy API key
- `JWT_SECRET` — JWT signing secret (optional, has default)
- `PORT` — Server port (auto-assigned)
