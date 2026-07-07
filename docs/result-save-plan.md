# Result Save Plan

- feature flag `enableClientResultSave`는 현재 client save testing을 위해 `true`이다.
- `SaveResultButton`은 로그인 사용자에게만 보이며 `/api/saju/save`를 호출한다.
- server route는 여전히 인증을 강제한다.
- 익명 사용자는 기존처럼 `sessionStorage`만으로 결과를 확인한다.
- end-to-end 저장이 실패하면 `FEATURE_FLAGS.enableClientResultSave`를 다시 `false`로 돌린다.
- service role key는 브라우저에서 절대 사용하지 않는다.
