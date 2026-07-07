# 배포 후 체크리스트

## 1. Production URL

- https://sajunala1.vercel.app

## 2. Verified

- `/api/health` returns healthy JSON
- `environment` is `production`

## 3. Need to verify

- `/robots.txt`
- `/sitemap.xml`
- home page
- result flow
- `/premium` page
- browser devtools에 secret이 보이지 않는지 확인
- UI에서 AI API call이 발생하지 않는지 확인
- UI에서 payment API call이 발생하지 않는지 확인

## 4. Supabase checklist

- `db/schema.sql` applied in Supabase SQL Editor
- tables exist:
  - `profiles`
  - `saju_results`
  - `reports`
  - `payments`
- RLS enabled

## 5. Current feature status

- Saju calculation API works with deterministic placeholder engine
- AI summary API is skeleton only
- payment prepare API is skeleton only
- Supabase keys are configured in Vercel
- no database writes are active yet
- no auth UI yet

## 6. Production check URLs

- https://sajunala1.vercel.app/api/health
- https://sajunala1.vercel.app/robots.txt
- https://sajunala1.vercel.app/sitemap.xml
- https://sajunala1.vercel.app/premium

## 7. Next recommended task

Start Supabase read/write integration for authenticated users only, beginning with auth planning or login UI.
