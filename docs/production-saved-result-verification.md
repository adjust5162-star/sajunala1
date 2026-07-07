# Production 저장 결과 검증 체크리스트

## 목적

Production 환경에서 로그인한 테스트 사용자가 저장된 사주 결과 목록과 상세 페이지를 읽기 전용으로 확인한다.

## 사전 조건

- Vercel production 배포 완료
- Supabase 환경변수 Vercel에 설정 완료
- Supabase SQL Editor에서 `db/schema.sql` 실행 완료
- `profiles`, `saju_results`, `reports`, `payments` 테이블 존재
- RLS 활성화
- Supabase Auth email/password 사용 가능

## 확인 URL

- https://sajunala1.vercel.app
- https://sajunala1.vercel.app/api/health
- https://sajunala1.vercel.app/saved
- https://sajunala1.vercel.app/premium

## 익명 사용자 확인

1. 로그아웃 상태로 홈 접속
2. 사주 입력 후 결과 페이지 정상 표시 확인
3. 저장 버튼이 보이지 않는지 확인
4. `/saved` 접속 시 로그인 안내 확인
5. `/saved/test-id` 직접 접속 시 로그인 안내 확인
6. Network 탭에서 `/api/saju/save` 요청 0회 확인
7. AI 요청 0회 확인
8. 결제 요청 0회 확인

## 로그인 사용자 확인

1. 테스트 이메일로 회원가입 또는 로그인
2. 홈에서 사주 입력
3. `/result`에서 저장 버튼 확인
4. “사주 결과 저장” 클릭
5. Network 탭에서 `POST /api/saju/save` 1회 발생 확인
6. 성공 메시지 확인
7. Supabase Table Editor > `saju_results`에서 row 생성 확인
8. `/saved` 접속
9. 저장된 결과 카드 표시 확인
10. “상세 보기” 클릭
11. `/saved/[id]` 상세 페이지 정상 표시 확인
12. 사주팔자, 오행, 십신, 12신살, 대운, 세운 영역이 crash 없이 표시되는지 확인
13. 상세 페이지가 읽기 전용인지 확인
14. 수정/삭제 버튼이 없는지 확인
15. AI 요청 0회 확인
16. 결제 요청 0회 확인

## RLS 확인

- 다른 테스트 계정으로 로그인했을 때 기존 계정의 저장 결과가 보이지 않아야 한다.
- 직접 `/saved/[id]` URL을 입력해도 본인 row가 아니면 “저장된 결과를 찾을 수 없습니다.”가 보여야 한다.

## 실패 시 점검

- Vercel 환경변수 확인
- Vercel Redeploy 여부 확인
- Supabase Auth email/password 활성화 여부 확인
- `db/schema.sql` 적용 여부 확인
- `saju_results` RLS policy 확인
- 브라우저 쿠키/session 확인
- `/api/health` production 응답 확인

## 다음 단계

읽기 전용 검증이 완료되면, 이후에만 안전한 인증 기반 삭제 route를 고려한다.
