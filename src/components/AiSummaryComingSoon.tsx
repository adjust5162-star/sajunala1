export function AiSummaryComingSoon() {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">AI 사주 요약 준비 중</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
          현재는 계산된 사주 데이터를 안정적으로 표시하는 단계입니다. 다음 단계에서 검증된 사주
          JSON을 바탕으로 건강운, 재물운, 관계운, 대운 흐름을 요약하는 AI 리포트가 연결됩니다.
        </p>
      </div>

      <ul className="mb-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
        <li>무료 요약: 1회 호출로 토큰 절약</li>
        <li>Pro 리포트: 섹션별 생성으로 비용 절감</li>
        <li>계산은 코드가 담당, AI는 해석만 담당</li>
      </ul>

      <button
        className="w-full cursor-not-allowed rounded-md border border-slate-300 bg-slate-100 px-4 py-3 font-semibold text-slate-500"
        disabled
        type="button"
      >
        AI 요약 준비 중
      </button>

      <p className="mt-3 text-xs leading-5 text-[var(--muted)]">아직 AI API는 호출하지 않습니다.</p>
    </section>
  );
}
