# Auth Plan

- 현재는 로그인 UI만 추가한다.
- 익명 사용자는 `sessionStorage` 기반으로 계속 사용 가능하다.
- 로그인 후 다음 단계에서 `user_id` + `input_hash` 기준으로 `saju_results` 저장을 붙인다.
- `reports` 테이블은 AI 리포트 섹션 캐싱에 사용한다.
- `SUPABASE_SERVICE_ROLE_KEY`는 클라이언트에서 절대 사용하지 않는다.
