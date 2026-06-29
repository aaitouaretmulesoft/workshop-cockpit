# Workshop Cockpit

A small, single-page Next.js app to hand out unique credentials to participants
during a MuleSoft hands-on session (~100 users). Each person enters their
first & last name and gets a `username` / `password` pair from a pre-loaded
pool. Same name on the form returns the same credentials — no double-spending,
no double-allocation under concurrency.

Stack: **Next.js 15 (App Router) · React 19 · Tailwind · Prisma · Vercel Postgres**.

---

## What's where

```
app/
  page.js              Participant dashboard (form + docs)
  actions.js           claimCredential() server action (transactional)
  components/          ClaimForm, CopyField — client components
  admin/
    page.js            Admin cockpit (metrics, search, table)
    actions.js         resetCredential() server action
  api/admin/seed/      Fallback POST/GET seed endpoint
prisma/
  schema.prisma        Credential model
  seed.js              Reads credentials.csv → Postgres
credentials.csv        username,password (one row per participant)
lib/prisma.js          Prisma client singleton
```

---

## Run it locally

1. Install dependencies

   ```bash
   npm install
   ```

2. Provision a database. Easiest path is `vercel link` + `vercel env pull`:

   ```bash
   npx vercel link
   npx vercel env pull .env
   ```

   Or copy `.env.example` to `.env` and fill in `POSTGRES_PRISMA_URL` /
   `POSTGRES_URL_NON_POOLING` manually (any Postgres works for local dev).

3. Push the schema and seed credentials

   ```bash
   npm run db:push
   npm run db:seed
   ```

   The seed reads `credentials.csv` at the project root and **only inserts if
   the table is empty** — safe to re-run.

4. Start the dev server

   ```bash
   npm run dev
   ```

   - Participant page: <http://localhost:3000>
   - Admin cockpit:    <http://localhost:3000/admin>

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, **New Project → Import** the repo.
3. **Storage → Create → Postgres** and connect it to the project. Vercel
   auto-injects `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`.
4. Deploy. The build runs `prisma generate` automatically.
5. Apply the schema once against the production DB:

   ```bash
   npx vercel env pull .env.production.local
   npx prisma db push
   ```

6. Seed in either of two ways:
   - From your machine: `DATABASE_URL=... npm run db:seed`
   - Via the API route: `POST https://<your-app>/api/admin/seed`
     (include `x-seed-secret: $SEED_SECRET` if you set one).

   The seed is idempotent — it skips if the table already has rows.

---

## How the claim flow works

`claimCredential` runs inside a single transaction:

1. Look up an existing assignment for the (firstName, lastName) pair, case-
   and whitespace-insensitive. Found → return that same row.
2. Otherwise, pick the lowest-id unassigned row and update it with an
   `updateMany` that asserts `assignedToFirstName: null`. If the count comes
   back as 0, another request beat us to it — we loop and try the next free
   row (up to 5 attempts).

That `updateMany` + count check is the optimistic lock. Two participants
clicking at the same millisecond can never collide on the same row.

If the pool is exhausted, the form shows a clear empty-state message asking
the participant to talk to the facilitator.

---

## Admin actions

- **Search** by first name, last name, or username.
- **Reset** an assigned row to clear the name + timestamp (useful when
  someone misspells their name on the first attempt). The freed row goes
  back to the front of the queue.

---

## Customizing the credentials pool

Replace `credentials.csv` with your real pool — one row per participant:

```
username,password
acme-workshop-001,SomeStrongPassword!1
acme-workshop-002,SomeStrongPassword!2
...
```

A header row (`username,password`) is optional but recommended. To re-seed
from a fresh CSV after testing, clear the table first:

```bash
npx prisma studio   # then delete all Credential rows
# or
npx prisma db push --force-reset && npm run db:seed
```
