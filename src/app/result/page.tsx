"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SaveResultButton } from "../../components/SaveResultButton";
import type { SajuResult } from "../../lib/saju/types";
import { SajuResultView } from "../components/SajuResultView";

const SAJU_RESULT_STORAGE_KEY = "saju:last-result";

type StoredSajuResult =
  | SajuResult
  | {
      data: SajuResult;
      meta?: {
        input_hash?: string;
      };
    };

function parseStoredResult(value: string): { result: SajuResult; inputHash: string | null } | null {
  const parsed = JSON.parse(value) as StoredSajuResult;

  if ("data" in parsed) {
    return {
      result: parsed.data,
      inputHash: parsed.meta?.input_hash ?? parsed.data.inputHash ?? null,
    };
  }

  return {
    result: parsed,
    inputHash: parsed.inputHash ?? null,
  };
}

export default function ResultPage() {
  const [result, setResult] = useState<SajuResult | null>(null);
  const [inputHash, setInputHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SAJU_RESULT_STORAGE_KEY);
      const parsed = stored ? parseStoredResult(stored) : null;
      setResult(parsed?.result ?? null);
      setInputHash(parsed?.inputHash ?? null);
    } catch {
      setResult(null);
      setInputHash(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--brand)]">사주 결과</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              {result ? `${result.input.name}님의 사주 리포트` : "사주 리포트"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              현재는 검증용 placeholder 계산 결과를 표시합니다.
            </p>
          </div>
          <Link className="text-sm font-semibold text-[var(--brand)]" href="/">
            입력으로 돌아가기
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-[var(--line)] bg-white p-5 text-sm text-[var(--muted)]">
            결과를 불러오는 중입니다...
          </div>
        ) : result ? (
          <div className="space-y-5">
            <SajuResultView result={result} />
            <SaveResultButton inputHash={inputHash} result={result} hasResult />
          </div>
        ) : (
          <div className="rounded-lg border border-[var(--line)] bg-white p-5">
            <h2 className="text-lg font-bold text-slate-900">아직 계산된 결과가 없습니다.</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              입력 화면에서 정보를 작성하면 이곳에 사주 결과가 표시됩니다.
            </p>
            <Link
              className="mt-4 inline-block rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white"
              href="/"
            >
              입력하러 가기
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
