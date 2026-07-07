"use client";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "../../../lib/supabase/client";

type SavedSajuDetailRow = {
  id: string;
  input_hash: string;
  pillars_json: unknown;
  five_elements_json: unknown;
  ten_gods_json: unknown;
  twelve_shinsal_json: unknown;
  daewoon_json: unknown;
  sewoon_json: unknown;
  warnings_json: unknown;
  created_at: string;
  updated_at: string;
};

type PillarItem = {
  label?: string;
  koreanLabel?: string;
  stem?: string;
  branch?: string;
};

type ElementItem = {
  element?: string;
  koreanLabel?: string;
  score?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0;
}

function getItems(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (isRecord(value) && Array.isArray(value.items)) {
    return value.items;
  }

  return [];
}

function formatJsonPreview(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

function formatSavedDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function shortenHash(hash: string) {
  return `${hash.slice(0, 8)}...`;
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-bold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function renderPillars(value: unknown) {
  const items = getItems(value) as PillarItem[];

  if (items.length === 0) {
    return <p className="text-sm text-[var(--muted)]">사주팔자 데이터 준비 중</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {["year", "month", "day", "hour"].map((label) => {
        const item = items.find((pillar) => pillar.label === label);

        return (
          <div className="rounded-md bg-[var(--brand-soft)] p-3 text-center" key={label}>
            <p className="text-xs text-[var(--muted)]">{item?.koreanLabel ?? label}</p>
            <p className="mt-1 font-bold text-[var(--brand)]">
              {item ? `${item.stem ?? ""}${item.branch ?? ""}` : "-"}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function renderFiveElements(value: unknown) {
  const items = getItems(value) as ElementItem[];

  if (items.length === 0) {
    return <p className="text-sm text-[var(--muted)]">오행 데이터 준비 중</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {["wood", "fire", "earth", "metal", "water"].map((element) => {
        const item = items.find((entry) => entry.element === element);

        return (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700" key={element}>
            {item?.koreanLabel ?? element}: {item?.score ?? "-"}
          </span>
        );
      })}
    </div>
  );
}

function renderJsonSummary(value: unknown, fallback: string) {
  const preview = formatJsonPreview(value);

  if (!preview || preview === "{}" || preview === "[]") {
    return <p className="text-sm text-[var(--muted)]">{fallback}</p>;
  }

  return <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-sm text-slate-700">{preview}</pre>;
}

function renderArrayList(value: unknown, fallback: string) {
  if (!isNonEmptyArray(value)) {
    return <p className="text-sm text-[var(--muted)]">{fallback}</p>;
  }

  return (
    <ul className="space-y-2">
      {value.map((item, index) => (
        <li className="rounded-md bg-slate-50 p-3 text-sm text-slate-700" key={index}>
          {formatJsonPreview(item)}
        </li>
      ))}
    </ul>
  );
}

export default function SavedResultDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const supabase = useMemo<SupabaseClient | null>(() => createBrowserSupabaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [row, setRow] = useState<SavedSajuDetailRow | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [isLoadingRow, setIsLoadingRow] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;
    let isMounted = true;

    async function loadUser() {
      const { data } = await client.auth.getUser();

      if (!isMounted) {
        return;
      }

      setUser(data.user ?? null);
      setIsLoading(false);
    }

    loadUser();

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !user) {
      setRow(null);
      return;
    }

    const client = supabase;
    const userId = user.id;
    let isMounted = true;

    async function loadRow() {
      setIsLoadingRow(true);
      setNotFound(false);
      setErrorMessage("");

      const { data, error } = await client
        .from("saju_results")
        .select(
          "id,input_hash,pillars_json,five_elements_json,ten_gods_json,twelve_shinsal_json,daewoon_json,sewoon_json,warnings_json,created_at,updated_at",
        )
        .eq("id", id)
        .eq("user_id", userId)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      if (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to load saved saju result.");
        }

        setErrorMessage("저장된 결과를 불러오는 중 오류가 발생했습니다.");
        setRow(null);
      } else if (!data) {
        setNotFound(true);
        setRow(null);
      } else {
        setRow(data as SavedSajuDetailRow);
      }

      setIsLoadingRow(false);
    }

    loadRow();

    return () => {
      isMounted = false;
    };
  }, [id, supabase, user]);

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--brand)]">Saved Detail</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">저장된 사주 상세</h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              로그인한 사용자만 본인이 저장한 사주 결과를 확인할 수 있습니다.
            </p>
          </div>
          <div className="flex gap-3 text-sm font-semibold text-[var(--brand)]">
            <Link href="/saved">목록으로 돌아가기</Link>
            <Link href="/">새 사주 계산하기</Link>
          </div>
        </div>

        {!supabase ? (
          <DetailCard title="안내">
            <p className="text-sm text-[var(--muted)]">Supabase 설정이 필요합니다.</p>
          </DetailCard>
        ) : isLoading ? (
          <DetailCard title="안내">
            <p className="text-sm text-[var(--muted)]">로그인 상태 확인 중...</p>
          </DetailCard>
        ) : !user ? (
          <DetailCard title="안내">
            <p className="text-sm text-[var(--muted)]">로그인 후 저장된 결과를 확인할 수 있습니다.</p>
            <Link className="mt-4 inline-block text-sm font-semibold text-[var(--brand)]" href="/">
              홈으로 돌아가기
            </Link>
          </DetailCard>
        ) : errorMessage ? (
          <DetailCard title="오류">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </DetailCard>
        ) : isLoadingRow ? (
          <DetailCard title="안내">
            <p className="text-sm text-[var(--muted)]">저장된 결과를 불러오는 중입니다...</p>
          </DetailCard>
        ) : notFound || !row ? (
          <DetailCard title="안내">
            <p className="text-sm text-[var(--muted)]">저장된 결과를 찾을 수 없습니다.</p>
            <Link className="mt-4 inline-block text-sm font-semibold text-[var(--brand)]" href="/saved">
              목록으로 돌아가기
            </Link>
          </DetailCard>
        ) : (
          <div className="space-y-5">
            <DetailCard title="기본 정보">
              <div className="space-y-2 text-sm text-slate-700">
                <p>저장일: {formatSavedDate(row.created_at)}</p>
                <p>수정일: {formatSavedDate(row.updated_at)}</p>
                <p>input_hash: {shortenHash(row.input_hash)}</p>
              </div>
            </DetailCard>

            <DetailCard title="사주팔자">{renderPillars(row.pillars_json)}</DetailCard>
            <DetailCard title="오행 분포">{renderFiveElements(row.five_elements_json)}</DetailCard>
            <DetailCard title="십신">{renderJsonSummary(row.ten_gods_json, "십신 데이터 준비 중")}</DetailCard>
            <DetailCard title="12신살">{renderJsonSummary(row.twelve_shinsal_json, "12신살 데이터 준비 중")}</DetailCard>
            <DetailCard title="대운">{renderArrayList(row.daewoon_json, "대운 데이터 준비 중")}</DetailCard>
            <DetailCard title="세운">{renderArrayList(row.sewoon_json, "세운 데이터 준비 중")}</DetailCard>
            <DetailCard title="경고/안내">{renderArrayList(row.warnings_json, "특이 안내 없음")}</DetailCard>
          </div>
        )}
      </div>
    </main>
  );
}
