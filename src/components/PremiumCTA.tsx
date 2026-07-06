import Link from "next/link";
import { PRICING } from "../lib/pricing/config";

export function PremiumCTA() {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">Pro 심층 리포트</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
          건강운, 재물운, 관계운, 대운 흐름을 더 자세히 살펴보는 유료 리포트 자리입니다.
        </p>
        <p className="mt-2 text-xl font-bold text-[var(--brand)]">{PRICING.pro_report.formattedPriceKo}</p>
      </div>

      <Link className="mb-3 inline-block text-sm font-semibold text-[var(--brand)]" href="/premium">
        미리보기 보기
      </Link>

      <button
        className="w-full cursor-not-allowed rounded-md border border-slate-300 bg-slate-100 px-4 py-3 font-semibold text-slate-500"
        disabled
        type="button"
      >
        결제 기능 준비 중
      </button>
    </section>
  );
}
