# Student Intake Application

A production-minded full-stack web application for a university admissions
team. Prospective students complete a guided 3-step intake flow (basic
information, academic interests, work area preferences), review their
answers, and submit. Submissions are persisted in a normalized relational
schema and exposed through a documented REST API, with an admin page to
browse them.

## Architecture

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, TypeScript) —
  a single codebase serves both the frontend pages and the backend API
  routes, so there's no separate client/server deployment to coordinate.
- **Database / ORM:** PostgreSQL + [Prisma](https://www.prisma.io) (v6,
  the current stable release — see [Notes on Prisma version](#notes-on-prisma-version)
  below). Schema changes are committed as migrations under
  `prisma/migrations/`, not applied ad hoc.
- **Validation:** [Zod](https://zod.dev) schemas in `src/lib/validation/`
  are the single source of truth for what a valid submission looks like.
  The same schemas run **client-side** (via `react-hook-form` +
  `@hookform/resolvers/zod`, for inline field errors) and **server-side**
  (in the API route, so the API is safe to call directly and never trusts
  the client).
- **Styling:** Tailwind CSS v4.

### Request flow for a submission

1. The 3 step pages (`/intake/basic-info`, `/intake/academic-interests`,
   `/intake/work-preferences`) each write into a shared `IntakeFormContext`
   (React Context + `useState`), mirrored to `sessionStorage` on every
   change. **No data is sent to the server until final submit** — this is
   what lets the user move forward and backward between steps without
   losing anything, including across a page refresh.
2. The review page (`/intake/review`) renders the accumulated state
   read-only and calls `POST /api/intakes` on submit.
3. The API route re-validates the full payload with the same Zod schema,
   then creates the `Student` row together with its `AcademicInterest`
   (+ `CourseOfInterest` rows) and `WorkPreference` (+ `WorkAreaPreference`
   rows) via a single nested Prisma `create` call (atomic).
4. On success the user is redirected to a confirmation page showing the
   new record's id; on failure an inline error banner is shown on the
   review page and the form data is preserved so the user can retry.
5. Submitted records are browsable at `/admin` (list) and `/admin/[id]`
   (detail), and are also available via the JSON API described below.

## Database schema

```
Student (1) ── (1) AcademicInterest (1) ── (N) CourseOfInterest
   │
   └──────── (1) WorkPreference (1) ── (N) WorkAreaPreference
```

- **`students`** — identity/contact fields (name, email, phone, DOB,
  mailing address).
- **`academic_interests`** — degree level, major, optional minor; 1:1 with
  `students`.
- **`courses_of_interest`** — one row per course of interest; N:1 back to
  `academic_interests` (this is what makes "one or more courses" a proper
  relational list instead of a CSV column).
- **`work_preferences`** — employment type, location type, notes; 1:1 with
  `students`.
- **`work_area_preferences`** — one row per preferred work area; N:1 back
  to `work_preferences`.

Full definitions: [`prisma/schema.prisma`](prisma/schema.prisma).
Generated SQL migration: [`prisma/migrations/`](prisma/migrations/).

## Setup

### Prerequisites

- Node.js 20+
- Docker (for the local Postgres container)

### 1. Start Postgres

```bash
docker compose up -d
```

This starts a `postgres:16-alpine` container on **port 5433** (mapped from
the container's 5432). Port 5433 was chosen instead of the default 5432
because 5432 is commonly already bound by a locally-installed Postgres —
if 5432 is free on your machine, feel free to change the mapping in
`docker-compose.yml` back to `5432:5432` (and update `DATABASE_URL`
accordingly).

### 2. Configure environment variables

```bash
cp .env.example .env
```

The default `DATABASE_URL` in `.env.example` matches the Docker Compose
credentials, so no edits are needed unless you changed the port above.

### 3. Install dependencies

```bash
npm install
```

### 4. Run migrations

```bash
npx prisma migrate dev
```

### 5. (Optional) Seed sample data

```bash
npm run db:seed
```

Inserts 4 sample submissions so the admin page isn't empty on first run.

### 6. Run the app

```bash
npm run dev
```

- Intake form: [http://localhost:3000/intake/basic-info](http://localhost:3000/intake/basic-info)
- Admin view: [http://localhost:3000/admin](http://localhost:3000/admin)

### Other useful commands

```bash
npm run build   # production build (also runs the TypeScript check)
npm run lint    # ESLint
npm run test    # Vitest — validation schema tests + one API route test
npx prisma studio  # browse the database in a GUI
```

## API

See [`docs/API.md`](docs/API.md) for the full reference with request/response
examples, or import [`openapi.yaml`](openapi.yaml) into Postman / the
[Swagger Editor](https://editor.swagger.io) for an interactive view.

| Method | Path                | Purpose                                   |
| ------ | ------------------- | ------------------------------------------ |
| POST   | `/api/intakes`      | Create a new intake submission             |
| GET    | `/api/intakes`      | List submissions (paginated)               |
| GET    | `/api/intakes/:id`  | Get one submission with full nested detail |

## Assumptions

- No authentication/authorization — this is a scoped take-home challenge,
  not a system handling real student PII in production. The `/admin` page
  is publicly reachable in this build; see trade-offs below.
- Single admissions cycle — no notion of terms, application deadlines, or
  multiple concurrent intake forms.
- Mailing address fields are free-text (no address validation/autocomplete
  API integration).
- "Preferred work areas" and "courses of interest" are drawn from a fixed
  suggested list (`src/lib/constants.ts`) but also accept free-text custom
  entries, since a real course/work-area catalog is out of scope.
- A submission is only persisted once, on final review-and-submit — there's
  no server-side "draft" saved per step (see trade-offs).

## Trade-offs, limitations, and what I'd improve with more time

- **No draft persistence in the DB.** Multi-step state lives in
  `sessionStorage` on the client, not the server. This satisfies "move
  forward/backward without losing data" and survives a refresh, but a
  student can't resume a half-finished application from a different
  device/browser. With more time I'd add an optional `DraftSubmission`
  table keyed by a resumption token.
- **No auth on `/admin`.** Anyone with the URL can view all submissions.
  A real deployment would put this behind admissions-staff authentication
  (e.g. NextAuth with a role check) before going further.
- **Minimal pagination.** `GET /api/intakes` supports `page`/`pageSize` but
  the admin UI doesn't yet expose pagination controls — it renders
  everything in one table, fine for a take-home dataset size.
- **No rate limiting or CAPTCHA** on the public submission endpoint.
- **Work areas / courses of interest are plain strings**, not their own
  lookup tables with IDs. This was a deliberate simplification (keeps the
  suggested list editable via a constants file, no migration needed to add
  an option) but a real system would likely want first-class `Course` and
  `WorkArea` reference tables, especially once admissions staff need to
  manage the catalog themselves.
- **No file uploads** (transcripts, resumes) — out of scope per the brief.
- **No email confirmation** sent on submission.
- Tests are intentionally lightweight (Zod schema validation + one API
  route test with a mocked Prisma client) given the take-home time budget;
  no browser/E2E test suite is checked in, though the full flow was
  manually verified end-to-end with a Playwright-driven browser during
  development.

### Notes on Prisma version

Prisma 7 (the very latest major, released shortly before this was built)
introduces a breaking change: connection strings move out of
`schema.prisma` into a driver-adapter pattern configured in
`prisma.config.ts`. That's a significant, very recent architecture shift,
so this project pins to **Prisma 6**, the well-established stable line,
for a setup that's easier for a reviewer to run and reason about.
