# 배포 체크리스트

이 문서는 배포 준비 절차만 정리합니다. 자동 배포를 실행하지 않습니다.

## 현재 상태

- Next.js app builds successfully
- smoke test scripts exist
- `/api/health` exists
- `robots.txt` and `sitemap.xml` exist
- Supabase schema exists in `db/schema.sql`
- AI and payment are skeleton only
- no real production secrets should be committed

## Supabase DB 적용

1. Supabase project를 생성합니다.
2. Supabase Dashboard를 엽니다.
3. SQL Editor로 이동합니다.
4. `db/schema.sql` 내용을 붙여넣습니다.
5. Run을 실행합니다.
6. 아래 테이블이 생성되었는지 확인합니다.

- `profiles`
- `saju_results`
- `reports`
- `payments`

7. RLS가 활성화되어 있는지 확인합니다.
8. `SUPABASE_SERVICE_ROLE_KEY`를 frontend code에 절대 붙여넣지 않습니다.

## `.env.local` 설정

`.env.example`을 템플릿으로 사용합니다.

필수:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
```

추후 선택:

```bash
OPENAI_API_KEY=
GEMINI_API_KEY=
TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
```

주의:

- `.env.local`을 commit하지 않습니다.
- API key를 chat에 붙여넣지 않습니다.
- 환경변수를 변경한 뒤에는 dev server를 재시작합니다.

## GitHub push

```bash
git status
git add .
git commit -m "Add deployment documentation"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_ID/YOUR_REPO_NAME.git
git push -u origin main
```

- remote가 이미 있으면 `git remote add origin`을 다시 실행하지 않습니다.
- `git remote -v`로 remote URL을 확인합니다.

## Vercel 배포

1. Vercel Dashboard를 엽니다.
2. Add New Project를 선택합니다.
3. GitHub repository를 import합니다.
4. Framework Preset은 `Next.js`로 둡니다.
5. Environment Variables를 추가합니다.
6. Deploy를 실행합니다.

## Vercel 환경변수

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `TOSS_CLIENT_KEY`
- `TOSS_SECRET_KEY`

주의:

- `SUPABASE_SERVICE_ROLE_KEY`는 server-only입니다.
- `OPENAI_API_KEY`, `GEMINI_API_KEY`, `TOSS_SECRET_KEY`는 server-only입니다.
- secret을 browser code에 노출하지 않습니다.

## DNS 설정

1. Vercel Project Settings로 이동합니다.
2. Domains 메뉴를 엽니다.
3. Domain을 추가합니다.
4. Vercel이 표시하는 DNS records를 복사합니다.
5. Domain registrar에서 records를 추가합니다.
6. DNS propagation을 기다립니다.
7. 아래 URL을 확인합니다.

- `https://YOUR_DOMAIN/api/health`
- `https://YOUR_DOMAIN/robots.txt`
- `https://YOUR_DOMAIN/sitemap.xml`

## 배포 후 확인

- `/api/health`가 healthy JSON을 반환합니다.
- home page가 열립니다.
- `/premium`이 열립니다.
- `/robots.txt`가 열립니다.
- `/sitemap.xml`이 열립니다.
- browser에 secret이 노출되지 않습니다.
- Vercel build logs에 missing env error가 없습니다.
