import { AuthStatus } from "./AuthStatus";

export function AuthCard() {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">로그인</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
          로그인하면 다음 단계에서 사주 계산 결과와 Pro 리포트를 안전하게 저장할 수 있습니다.
        </p>
      </div>

      <AuthStatus />

      <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
        현재 단계에서는 로그인만 준비하며, 사주 결과는 아직 서버에 저장하지 않습니다.
      </p>
    </section>
  );
}
