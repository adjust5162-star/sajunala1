# Vercel Import Checklist

## Vercel Dashboard 단계

1. Vercel Dashboard를 엽니다.
2. `Add New Project`를 선택합니다.
3. GitHub repository `adjust5162-star/sajunala1`을 import합니다.
4. `Framework Preset`은 `Next.js`로 설정합니다.
5. Environment Variables를 추가합니다.

## Environment Variables

필요한 값을 Vercel Project Settings의 Environment Variables에 추가합니다.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `OPENAI_API_KEY` optional later
- `GEMINI_API_KEY` optional later
- `TOSS_CLIENT_KEY` optional later
- `TOSS_SECRET_KEY` optional later

첫 배포 후 실제 Vercel URL이 확정되면 필요에 따라 `NEXT_PUBLIC_SITE_URL`을 실제 Vercel URL로 설정하고 redeploy합니다.

## Deploy

1. Environment Variables 입력을 확인합니다.
2. `Deploy`를 실행합니다.
3. Build log에서 missing env error가 없는지 확인합니다.

## Verify

배포가 끝나면 아래 경로를 확인합니다.

- `/api/health`
- `/robots.txt`
- `/sitemap.xml`

## Secret Safety

- secret을 source code에 붙여넣지 않습니다.
- `.env.local`을 commit하지 않습니다.
- API key를 chat, issue, pull request, screenshot에 노출하지 않습니다.
