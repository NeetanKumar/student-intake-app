# Student Intake Application

A full-stack app for a university admissions team. Students complete a
3-step intake form (basic info → academic interests → work preferences),
review, and submit. Submissions are stored in a normalized Postgres schema
and exposed via a REST API, with an admin page to browse them.

**Stack:** Next.js 16 (App Router, TypeScript) · PostgreSQL + Prisma 6 ·
Zod + react-hook-form · Tailwind CSS v4.

## Run it

### Option A — Docker (full stack)

```bash
docker compose up --build
```

Builds the app image, starts Postgres, applies migrations automatically,
and serves the app at [http://localhost:3000](http://localhost:3000). No
local Node install needed.

### Option B — Local dev

```bash
docker compose up -d postgres   # Postgres only, on localhost:5433
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed                 # optional: 4 sample submissions
npm run dev
```

- Intake form: [http://localhost:3000/intake/basic-info](http://localhost:3000/intake/basic-info)
- Admin view: [http://localhost:3000/admin](http://localhost:3000/admin)

Port 5433 (not 5432) is used for the host-mapped Postgres port to avoid
clashing with a locally-installed Postgres; change it in
`docker-compose.yml` + `.env` if you don't need to.

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
- `/admin` and `/admin/[id]` read directly from Prisma to list/display
  submissions; the same data is available over the JSON API.

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

## Assumptions

- No authentication — a scoped build, not a system for real student PII.
- Single admissions cycle; no terms/deadlines/multiple concurrent forms.
- Work areas and courses are suggested from a fixed list
  (`src/lib/constants.ts`) but accept free-text custom entries.
- A submission is only persisted once, on final review-and-submit.

## Trade-offs & what I'd improve with more time

- **No server-side drafts.** Multi-step state lives in `sessionStorage`,
  not the DB — fine for "don't lose data mid-flow," but a student can't
  resume from a different device.
- **No auth on `/admin`.** Would add role-gated auth before shipping this
  for real.
- **Admin list has no pagination UI** yet, though the API supports it.
- **No rate limiting/CAPTCHA** on the public submission endpoint.
- **Work areas/courses are plain strings**, not reference tables with IDs
  — simple to extend via a constants file now, but a real system would
  likely want first-class lookup tables once staff manage the catalog.
- No file uploads, no email confirmation on submission.
- Tests are intentionally lightweight (Zod schema tests + one API route
  test with mocked Prisma) given scope; the full flow was verified
  manually end-to-end with a real browser during development.
