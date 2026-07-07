import { AuthCard } from "../components/AuthCard";
import { SajuInputForm } from "./components/SajuInputForm";

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="space-y-5">
            <p className="text-sm font-semibold text-[var(--brand)]">한국어 사주 MVP</p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              생년월일로 준비하는 사주풀이
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
              지금은 입력과 결과 화면을 안정적으로 제공하는 단계입니다. 로그인은 선택 사항이며,
              익명 사용자도 계속 사주 결과를 확인할 수 있습니다.
            </p>
          </div>

          <SajuInputForm />
        </section>

        <AuthCard />
      </div>
    </main>
  );
}
