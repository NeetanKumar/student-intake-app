# Student Intake Application

A full-stack app for a university admissions team. Students complete a
3-step intake form (basic info → academic interests → work preferences),
review, and submit. Submissions are stored in a normalized Postgres schema
and exposed via a REST API, with an admin dashboard to browse them.

**Stack:** Next.js 16 (App Router, TypeScript) · PostgreSQL + Prisma 6 ·
Zod + react-hook-form · Tailwind CSS v4.

## Run it

### Option A — Docker (full stack)

```bash
docker compose up --build
```

Builds the app image, starts Postgres, applies migrations, and seeds a
few sample submissions on first run (skipped automatically once the
database has data). Serves the app at
[http://localhost:3000](http://localhost:3000). No local Node install
needed.

### Option B — Local dev

```bash
docker compose up -d postgres   # Postgres only, on localhost:5433
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed                 # optional: sample submissions
npm run dev
```

- Intake form: [http://localhost:3000/intake/basic-info](http://localhost:3000/intake/basic-info)
- Admin view: [http://localhost:3000/admin](http://localhost:3000/admin)

### Other commands

```bash
npm run build   # production build + typecheck
npm run lint    # ESLint
npm run test    # Vitest — validation schemas + one API route test
npx prisma studio
```

## Architecture

- Single Next.js codebase serves both the frontend and the API routes.
- Zod schemas in `src/lib/validation/` validate on both the client
  (inline field errors via react-hook-form) and the server (API routes
  never trust client input).
- The 3 form steps write into a shared `IntakeFormContext`, persisted to
  `sessionStorage`. Nothing hits the database until final submit — that's
  what lets users move forward/backward without losing data.
- On submit, `POST /api/intakes` creates the `Student` row plus its
  `AcademicInterest`/`WorkPreference` (and their child rows) in one nested
  Prisma `create` call.
- `/admin` is a dashboard; `/admin/enrollments` and
  `/admin/enrollments/[id]` read directly from Prisma to list/display
  submissions. The same data is available over the JSON API.

## Database schema

```
Student (1) ── (1) AcademicInterest (1) ── (N) CourseOfInterest
   │
   └──────── (1) WorkPreference (1) ── (N) WorkAreaPreference
```

Courses and work areas are child tables (not CSV columns) to keep the
"one or more" fields properly normalized. Full definitions:
[`prisma/schema.prisma`](prisma/schema.prisma) · migration:
[`prisma/migrations/`](prisma/migrations/).

## API

| Method | Path               | Purpose                                    |
| ------ | ------------------ | ------------------------------------------- |
| POST   | `/api/intakes`     | Create a new intake submission              |
| GET    | `/api/intakes`     | List submissions (paginated)                |
| GET    | `/api/intakes/:id` | Get one submission with full nested detail  |

Full reference with examples: [`docs/API.md`](docs/API.md) · machine-readable
spec: [`openapi.yaml`](openapi.yaml).

## What else could be incorporated

- No authentication — the admin dashboard is open to anyone with the URL.
- Multi-step form state lives in `sessionStorage`, not the database, so a
  submission can't be resumed from a different device.
- No pagination UI on the enrollments list (the API supports it).
- No rate limiting/CAPTCHA on the public submission endpoint.
- Work areas and courses are plain strings, suggested from a constants
  file, rather than managed reference tables.
- No file uploads, no email confirmation on submission.
