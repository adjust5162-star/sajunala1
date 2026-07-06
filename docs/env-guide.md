# 환경변수 가이드

- API key를 chat에 절대 붙여넣지 않습니다.
- `.env.local`을 절대 commit하지 않습니다.
- `.env.example`에는 placeholder만 둡니다.
- `NEXT_PUBLIC_*` 값은 browser에서 볼 수 있습니다.
- `SUPABASE_SERVICE_ROLE_KEY`는 server-only입니다.
- `OPENAI_API_KEY`는 server-only입니다.
- `GEMINI_API_KEY`는 server-only입니다.
- `TOSS_SECRET_KEY`는 server-only입니다.
- `TOSS_CLIENT_KEY`는 추후 frontend payment widget에 필요할 때만 public으로 사용할 수 있습니다.
- `NEXT_PUBLIC_SITE_URL`은 최종 deployment URL로 설정합니다.
- local env var를 변경한 뒤에는 `npm run dev`를 재시작합니다.
- 중요한 production env var를 변경한 뒤에는 Vercel을 redeploy합니다.

## 권장 파일 사용

`.env.example`을 복사해 `.env.local`을 만들고 실제 값은 local 또는 Vercel dashboard에만 입력합니다.

```bash
cp .env.example .env.local
```

실제 secret 값은 문서, issue, pull request, screenshot, chat에 남기지 않습니다.
