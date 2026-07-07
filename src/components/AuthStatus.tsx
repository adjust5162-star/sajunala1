"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { AuthUiState } from "../lib/auth/types";
import { createBrowserSupabaseClient } from "../lib/supabase/client";

function getFriendlyAuthError(message?: string) {
  if (!message) {
    return "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }

  if (message.toLowerCase().includes("invalid")) {
    return "이메일 또는 비밀번호를 확인해 주세요.";
  }

  return "로그인 요청을 처리하지 못했습니다. 입력값을 확인해 주세요.";
}

export function AuthStatus() {
  const supabase = useMemo<SupabaseClient | null>(() => createBrowserSupabaseClient(), []);
  const [state, setState] = useState<AuthUiState>(supabase ? "loading" : "unavailable");
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setUser(data.session?.user ?? null);
      setState(data.session?.user ? "signed_in" : "signed_out");
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setState(session?.user ? "signed_in" : "signed_out");
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleLogin() {
    if (!supabase) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(getFriendlyAuthError(error.message));
    }

    setIsSubmitting(false);
  }

  async function handleSignUp() {
    if (!supabase) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(getFriendlyAuthError(error.message));
    } else {
      setMessage("회원가입 요청이 접수되었습니다. 이메일 확인이 필요할 수 있습니다.");
    }

    setIsSubmitting(false);
  }

  async function handleLogout() {
    if (!supabase) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      setMessage("로그아웃하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }

    setIsSubmitting(false);
  }

  if (state === "unavailable") {
    return <p className="text-sm text-[var(--muted)]">로그인 기능 준비 중</p>;
  }

  if (state === "loading") {
    return <p className="text-sm text-[var(--muted)]">로그인 상태 확인 중...</p>;
  }

  if (state === "signed_in") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-700">
          로그인됨: <span className="font-semibold">{user?.email ?? "이메일 없음"}</span>
        </p>
        <Link className="block text-sm font-semibold text-[var(--brand)]" href="/saved">
          저장된 결과 보기
        </Link>
        <button
          className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          onClick={handleLogout}
          type="button"
        >
          로그아웃
        </button>
        {message ? <p className="text-sm text-red-700">{message}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <input
        className="field"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="이메일"
        type="email"
        value={email}
      />
      <input
        className="field"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="비밀번호"
        type="password"
        value={password}
      />
      <div className="grid grid-cols-2 gap-2">
        <button
          className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          onClick={handleLogin}
          type="button"
        >
          로그인
        </button>
        <button
          className="rounded-md border border-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          onClick={handleSignUp}
          type="button"
        >
          회원가입
        </button>
      </div>
      {message ? <p className="text-sm text-red-700">{message}</p> : null}
    </div>
  );
}
