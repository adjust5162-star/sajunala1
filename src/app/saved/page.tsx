"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "../../lib/supabase/client";

type SavedSajuRow = {
  id: string;
  input_hash: string;
  pillars_json: unknown;
  five_elements_json: unknown;
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

function formatSavedDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function shortenHash(hash: string) {
  return `${hash.slice(0, 8)}...`;
}

function getItems(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object" && "items" in value) {
    const items = (value as { items?: unknown }).items;
    return Array.isArray(items) ? items : [];
  }

  return [];
}

function renderPillars(value: unknown) {
  const items = getItems(value) as PillarItem[];

  if (items.length === 0) {
    return <p className="text-sm text-[var(--muted)]">계산 데이터 준비 중</p>;
  }

  const labels = ["year", "month", "day", "hour"];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {labels.map((label) => {
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
    return <p className="text-sm text-[var(--muted)]">계산 데이터 준비 중</p>;
  }

  const order = ["wood", "fire", "earth", "metal", "water"];

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {order.map((element) => {
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

export default function SavedResultsPage() {
  const supabase = useMemo<SupabaseClient | null>(() => createBrowserSupabaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [rows, setRows] = useState<SavedSajuRow[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [isLoadingRows, setIsLoadingRows] = useState(false);
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
      setRows([]);
      return;
    }

    const client = supabase;
    let isMounted = true;

    async function loadRows() {
      setIsLoadingRows(true);
      setErrorMessage("");

      const { data, error } = await client
        .from("saju_results")
        .select("id,input_hash,pillars_json,five_elements_json,created_at,updated_at")
        .order("created_at", { ascending: false })
        .limit(20);

      if (!isMounted) {
        return;
      }

      if (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to load saved saju results.");
        }
        setErrorMessage("저장된 결과를 불러오는 중 오류가 발생했습니다.");
        setRows([]);
      } else {
        setRows((data ?? []) as SavedSajuRow[]);
      }

      setIsLoadingRows(false);
    }

    loadRows();

    return () => {
      isMounted = false;
    };
  }, [supabase, user]);

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--brand)]">Saved</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">저장된 사주 결과</h1>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              로그인한 사용자만 저장된 사주 결과를 확인할 수 있습니다.
            </p>
          </div>
          <Link className="text-sm font-semibold text-[var(--brand)]" href="/">
            홈으로 돌아가기
          </Link>
        </div>

        {!supabase ? (
          <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
            <p className="text-sm text-[var(--muted)]">Supabase 설정이 필요합니다.</p>
          </section>
        ) : isLoading ? (
          <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
            <p className="text-sm text-[var(--muted)]">로그인 상태 확인 중...</p>
          </section>
        ) : !user ? (
          <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
            <p className="text-sm text-[var(--muted)]">로그인 후 저장된 결과를 확인할 수 있습니다.</p>
            <Link className="mt-4 inline-block text-sm font-semibold text-[var(--brand)]" href="/">
              홈에서 로그인하기
            </Link>
          </section>
        ) : errorMessage ? (
          <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </section>
        ) : isLoadingRows ? (
          <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
            <p className="text-sm text-[var(--muted)]">저장된 결과를 불러오는 중입니다...</p>
          </section>
        ) : rows.length === 0 ? (
          <section className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm">
            <p className="text-sm text-[var(--muted)]">아직 저장된 사주 결과가 없습니다.</p>
          </section>
        ) : (
          <section className="grid gap-4">
            {rows.map((row) => (
              <article className="rounded-lg border border-[var(--line)] bg-white p-4 shadow-sm" key={row.id}>
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-slate-900">저장일: {formatSavedDate(row.created_at)}</p>
                  <p className="text-xs text-[var(--muted)]">input_hash: {shortenHash(row.input_hash)}</p>
                </div>

                {renderPillars(row.pillars_json)}
                {renderFiveElements(row.five_elements_json)}

                <Link className="mt-4 inline-block text-sm font-semibold text-[var(--brand)]" href={`/saved/${row.id}`}>
                  상세 보기
                </Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
