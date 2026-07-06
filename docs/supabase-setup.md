# Supabase Setup

This phase only prepares environment placeholders and helper files. The app does not import these helpers yet, does not write to the database, and does not add auth UI.

## Environment Variables

Copy `.env.example` to `.env.local` for local development and fill values from the Supabase dashboard when Supabase wiring begins.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
OPENAI_API_KEY=
GEMINI_API_KEY=
TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
```

## Client Boundary

- `src/lib/supabase/client.ts` is for browser-safe usage only.
- It uses only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Never place `SUPABASE_SERVICE_ROLE_KEY` in browser code.

## Server Boundary

- `src/lib/supabase/server.ts` imports `server-only`.
- It may use `SUPABASE_SERVICE_ROLE_KEY`, but only from server code.
- Do not expose service-role helpers through client components.

## Schema

The schema from `db/schema.sql` can be pasted into the Supabase SQL Editor later. Apply it before adding database reads or writes.
