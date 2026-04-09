# Lunch Roulette (MVP skeleton)

Internal app for colleagues to:
- share restaurants
- declare lunch intentions (dine-in / takeaway)
- run shortlist roulette
- rate restaurants after lunch

## What is included now
- **API** (Fastify + TypeScript + SQL via `pg`)
- **Web app** (Next.js app router)
- **Database** (PostgreSQL + migration + seed)
- **Local-first auth mode** (`AUTH_MODE=local`)

## Prerequisites
- Node.js 20+
- Docker + Docker Compose

## Local run (end-to-end)

### 1) Install dependencies
```bash
npm install
```

### 2) Start Postgres
```bash
docker compose up -d
```

### 3) Initialize DB schema + seed
```bash
npm run db:migrate
npm run db:seed
```

### 4) Run API + Web
```bash
npm run dev
```

- API: http://localhost:4000/health
- Web: http://localhost:3000

## MVP flows currently wired
- **Restaurants list** with eco-friendly flags
- **Roulette shortlist** with explicit restaurant selection
- **Distance from selected office** in meters (`/restaurants?officeId=<id>` uses geodesic distance)
- **Lunch intention form** to post intention for today
- **Review API** endpoint (`POST /reviews`) for post-lunch rating capture

## Useful API endpoints
- `GET /health`
- `GET /users`
- `GET /me` (local mode user resolution/auto-provision)
- `GET /offices`
- `GET /restaurants`
- `GET /restaurants?officeId=<office-id>`
- `POST /intentions`
- `POST /roulette/spin`
- `POST /reviews`

## Auth modes
- `AUTH_MODE=local` (default): uses `x-dev-user-email` header or fallback `alice@example.com`
- `AUTH_MODE=azuread`: reserved for next step integration

## Next recommended steps
1. Add office management UI + user default office selection.
2. Add afternoon reminder job to request review from users with declared lunch intention.
3. Add walking route distance provider and cache results.
4. Add test suite (API route integration + web smoke tests).
