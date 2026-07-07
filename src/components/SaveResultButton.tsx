"use client";

import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { isClientResultSaveEnabled } from "../lib/features/flags";
import type { SajuResult } from "../lib/saju/types";
import { createBrowserSupabaseClient } from "../lib/supabase/client";

type SaveResultButtonProps = {
  inputHash?: string | null;
  result?: SajuResult | null;
  hasResult?: boolean;
};

type SaveResultResponse =
  | { ok: true; status: "saved"; input_hash: string }
  | { ok: false; error: string; message: string };

function buildSaveResultPayload(result: SajuResult) {
  return {
    pillars: { items: result.pillars },
    fiveElements: { items: result.fiveElements },
    tenGods: result.tenGods,
    twelveShinsal: result.twelveShinsal,
    daewoon: result.daewoon.timeline,
    sewoon: [result.sewoon],
    warnings: [
      "계산 결과 저장용 JSON입니다.",
      "AI 해석, 결제 정보, 개인정보 원문은 포함하지 않습니다.",
    ],
  };
}

function getSaveErrorMessage(error: string) {
  if (error === "AUTH_REQUIRED") {
    return "로그인해야 저장할 수 있습니다.";
  }

  if (error === "SUPABASE_NOT_CONFIGURED") {
    return "Supabase 서버 설정이 필요합니다.";
  }

  return "저장 중 오류가 발생했습니다.";
}

export function SaveResultButton({ inputHash = null, result = null, hasResult = false }: SaveResultButtonProps) {
  const supabase = useMemo<SupabaseClient | null>(() => createBrowserSupabaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const isEnabled = isClientResultSaveEnabled();

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setUser(data.user ?? null);
      setIsLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSave() {
    if (!supabase || !isEnabled || !hasResult || !inputHash || !result) {
      return;
    }

    setIsSaving(true);
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setMessage("로그인해야 저장할 수 있습니다.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/saju/save", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          input_hash: inputHash,
          result: buildSaveResultPayload(result),
        }),
      });
      const json = (await response.json()) as SaveResultResponse;

      if (!response.ok || !json.ok) {
        setMessage(json.ok ? "저장 중 오류가 발생했습니다." : getSaveErrorMessage(json.error));
        return;
      }

      setMessage("저장이 완료되었습니다.");
    } catch {
      setMessage("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!supabase || isLoading || !user) {
    return null;
  }

  const canSave = isEnabled && hasResult && Boolean(inputHash) && Boolean(result);

  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">사주 결과 저장</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
          로그인된 사용자만 결과 저장을 사용할 수 있습니다.
        </p>
      </div>

      <button
        className="w-full rounded-md bg-[var(--brand)] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
        disabled={!canSave || isSaving}
        onClick={handleSave}
        type="button"
      >
        {isSaving ? "저장 중..." : canSave ? "사주 결과 저장" : "저장 기능 준비 중"}
      </button>

      {!inputHash ? (
        <p className="mt-3 text-xs leading-5 text-red-700">
          저장 키가 없어 저장할 수 없습니다. 다시 계산해 주세요.
        </p>
      ) : (
        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
          서버 인증 저장을 검증한 뒤 저장 결과를 목록에서 확인할 수 있게 확장합니다.
        </p>
      )}

      {message ? <p className="mt-3 text-sm text-slate-700">{message}</p> : null}
    </section>
  );
}
