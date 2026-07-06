# Vercel DNS 가이드

## Domain 추가

Vercel Project Settings > Domains에서 domain을 추가합니다.

DNS 값은 추측하지 않습니다. Vercel이 보여주는 DNS records를 그대로 복사해 domain registrar에 설정합니다.

## 일반적인 패턴

- apex/root domain은 A record 또는 Vercel이 권장하는 record를 사용합니다.
- `www`는 Vercel이 권장하는 경우 CNAME을 사용하는 일이 많습니다.
- 실제 값은 항상 Vercel 화면에 표시된 값을 기준으로 합니다.

## Registrar 설정

1. Domain registrar의 DNS settings를 엽니다.
2. Vercel이 안내한 DNS records를 추가합니다.
3. 기존 record와 충돌하지 않는지 확인합니다.
4. 저장한 뒤 DNS propagation을 기다립니다.

DNS propagation은 시간이 걸릴 수 있습니다.

## Verify

아래 URL을 확인합니다.

- `https://YOUR_DOMAIN/api/health`
- `https://YOUR_DOMAIN/robots.txt`
- `https://YOUR_DOMAIN/sitemap.xml`

## DNS가 실패할 때

- Registrar DNS records를 다시 확인합니다.
- 충돌하는 old A/CNAME records를 제거합니다.
- Vercel domain status를 확인합니다.
- 잠시 기다린 뒤 다시 시도합니다.
