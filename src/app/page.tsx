import { SajuInputForm } from "./components/SajuInputForm";

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="space-y-5">
          <p className="text-sm font-semibold text-[var(--brand)]">한국어 사주 MVP</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            생년월일로 준비하는 사주풀이
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
            지금은 입력과 결과 화면을 먼저 정리하는 단계입니다. 계산, AI 해석, 저장, 결제는 아직
            연결하지 않았습니다.
          </p>
        </div>

        <SajuInputForm />
      </section>
    </main>
  );
}
