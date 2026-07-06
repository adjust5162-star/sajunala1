import Link from "next/link";
import { PRICING } from "../../lib/pricing/config";

const lockedCards = [
  "건강운 상세 리포트",
  "재물운 상세 리포트",
  "관계·부부운 리포트",
  "직업·커리어 리포트",
  "12신살 상세 해석",
  "대운·세운 타임라인",
  "월별 실천 가이드",
];

export default function PremiumPage() {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--brand)]">Premium</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Pro 심층 리포트 미리보기</h1>
            <p className="mt-2 text-2xl font-bold text-[var(--brand)]">{PRICING.pro_report.formattedPriceKo}</p>
          </div>
          <Link className="text-sm font-semibold text-[var(--brand)]" href="/result">
            결과로 돌아가기
          </Link>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lockedCards.map((title) => (
            <article className="rounded-lg border border-[var(--line)] bg-white p-4 shadow-sm" key={title}>
              <p className="text-xs font-semibold text-[var(--muted)]">잠금</p>
              <h2 className="mt-2 text-lg font-bold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                결제 기능이 연결되면 이 섹션의 상세 리포트를 확인할 수 있습니다.
              </p>
              <button
                className="mt-4 w-full cursor-not-allowed rounded-md border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500"
                disabled
                type="button"
              >
                준비 중
              </button>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
