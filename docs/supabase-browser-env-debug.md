# Supabase 브라우저 환경변수 진단

## 증상

Production 홈 화면에서 로그인 카드가 “로그인 기능 준비 중”으로 표시된다.

## 의미

브라우저용 Supabase client가 아래 환경변수를 읽지 못하고 있다.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Vercel에서 확인할 것

Vercel Dashboard  
→ Project  
→ Settings  
→ Environment Variables

Production 환경에 아래 값이 있어야 한다.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase에서 값 찾는 곳

Supabase Dashboard  
→ Project Settings  
→ API

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 주의

- Key 칸에는 변수 이름만 넣는다.
- Value 칸에는 값만 넣는다.
- Key에 `=` 기호를 넣지 않는다.
- 값 앞뒤 공백을 제거한다.
- Production 환경이 선택되어 있어야 한다.
- 수정 후 반드시 Redeploy한다.
- API key 원문은 문서, GitHub, 채팅에 쓰지 않는다.

## 정상 기준

Redeploy 후 홈 화면 로그인 카드에:

- 이메일 입력칸
- 비밀번호 입력칸
- 로그인 버튼
- 회원가입 버튼

이 보여야 한다.

## 비정상 기준

계속 “로그인 기능 준비 중”이 보이면 Production env가 build에 반영되지 않은 것이다.
