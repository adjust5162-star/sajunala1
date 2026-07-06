import { AiSummaryComingSoon } from "../../components/AiSummaryComingSoon";
import { PremiumCTA } from "../../components/PremiumCTA";
import type { SajuResult } from "../../lib/saju/types";
import { SectionCard } from "./SectionCard";

export function SajuResultView({ result }: { result: SajuResult }) {
  return (
    <div className="space-y-5">
      <AiSummaryComingSoon />

      <SectionCard title="사주 원국" description="API에서 받은 placeholder 계산 결과입니다.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {result.pillars.map((pillar) => (
            <div className="rounded-md bg-[var(--brand-soft)] p-4 text-center" key={pillar.label}>
              <p className="text-sm font-medium text-[var(--muted)]">{pillar.koreanLabel}</p>
              <p className="mt-2 text-2xl font-bold text-[var(--brand)]">
                {pillar.stem}
                {pillar.branch}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="오행 분포" description="추후 정식 계산 로직과 차트로 확장할 영역입니다.">
        <div className="space-y-3">
          {result.fiveElements.map((element) => (
            <div className="grid grid-cols-[32px_1fr_40px] items-center gap-3" key={element.element}>
              <span className="font-semibold text-slate-800">{element.koreanLabel}</span>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 rounded-full bg-[var(--brand)]" style={{ width: `${element.score}%` }} />
              </div>
              <span className="text-right text-sm text-[var(--muted)]">{element.score}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="십성 요약" description="확정 계산 전에는 단정적 해석을 제공하지 않습니다.">
        <p className="text-sm leading-6 text-slate-700">{result.tenGods.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {result.tenGods.items.map((item) => (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700" key={item}>
              {item}
            </span>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="십이신살" description="참고 지표를 차분하게 보여줄 영역입니다.">
        <div className="flex flex-wrap gap-2">
          {result.twelveShinsal.items.map((item) => (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700" key={item}>
              {item}
            </span>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="대운 흐름" description={`대운 시작 나이 placeholder: ${result.daewoon.startAge}세`}>
        <div className="grid gap-3 sm:grid-cols-3">
          {result.daewoon.timeline.map((item) => (
            <div className="rounded-md border border-slate-200 p-3" key={item.ageRange}>
              <p className="font-semibold text-slate-900">{item.ageRange}세</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{item.label}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <PremiumCTA />
    </div>
  );
}
