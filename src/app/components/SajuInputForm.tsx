"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { sajuInputSchema, type SajuInputDto } from "../../lib/saju/validators";
import type { SajuResult } from "../../lib/saju/types";

const SAJU_RESULT_STORAGE_KEY = "saju:last-result";

const genderOptions = [
  { label: "남성", value: "male" },
  { label: "여성", value: "female" },
  { label: "기타", value: "other" },
] as const;

const calendarOptions = [
  { label: "양력", value: "solar" },
  { label: "음력", value: "lunar" },
] as const;

type ApiResponse =
  | { ok: true; data: SajuResult }
  | { ok: false; error: string; message: string; issues?: unknown[] };

type FormState = {
  name: string;
  gender: SajuInputDto["gender"] | "";
  birthDate: string;
  birthTime: string;
  isBirthTimeUnknown: boolean;
  calendarType: SajuInputDto["calendarType"] | "";
  birthPlace: string;
};

const initialForm: FormState = {
  name: "",
  gender: "",
  birthDate: "",
  birthTime: "",
  isBirthTimeUnknown: false,
  calendarType: "solar",
  birthPlace: "",
};

function getFieldErrors(form: FormState) {
  const result = sajuInputSchema.safeParse(form);
  const errors: Partial<Record<keyof FormState, string>> = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof FormState | undefined;
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    }
  }

  if (form.isBirthTimeUnknown) {
    delete errors.birthTime;
  }

  return errors;
}

export function SajuInputForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fieldErrors = useMemo(() => getFieldErrors(form), [form]);

  const showError = (field: keyof FormState) => touched[field] && fieldErrors[field];

  function updateForm(next: Partial<FormState>) {
    setForm((current) => ({ ...current, ...next }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setTouched({
      name: true,
      gender: true,
      birthDate: true,
      birthTime: true,
      calendarType: true,
      birthPlace: true,
    });

    const payload = {
      ...form,
      birthTime: form.isBirthTimeUnknown ? "" : form.birthTime,
    };
    const parsed = sajuInputSchema.safeParse(payload);

    if (!parsed.success) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/saju/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await response.json()) as ApiResponse;

      if (!response.ok || !json.ok) {
        setSubmitError(json.ok ? "결과를 불러오지 못했습니다." : json.message);
        return;
      }

      sessionStorage.setItem(SAJU_RESULT_STORAGE_KEY, JSON.stringify(json.data));
      router.push("/result");
    } catch {
      setSubmitError("잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4 rounded-lg border border-[var(--line)] bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="name">
          이름
        </label>
        <input
          className="field"
          id="name"
          name="name"
          onBlur={() => setTouched((current) => ({ ...current, name: true }))}
          onChange={(event) => updateForm({ name: event.target.value })}
          placeholder="홍길동"
          type="text"
          value={form.name}
        />
        {showError("name") ? <p className="field-hint">{fieldErrors.name}</p> : null}
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-slate-800">성별</span>
        <div className="grid grid-cols-3 gap-2">
          {genderOptions.map((option) => (
            <label className="choice" key={option.value}>
              <input
                checked={form.gender === option.value}
                name="gender"
                onChange={() => {
                  updateForm({ gender: option.value });
                  setTouched((current) => ({ ...current, gender: true }));
                }}
                type="radio"
                value={option.value}
              />
              {option.label}
            </label>
          ))}
        </div>
        {showError("gender") ? <p className="field-hint">{fieldErrors.gender}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="birthDate">
            생년월일
          </label>
          <input
            className="field"
            id="birthDate"
            name="birthDate"
            onBlur={() => setTouched((current) => ({ ...current, birthDate: true }))}
            onChange={(event) => updateForm({ birthDate: event.target.value })}
            type="date"
            value={form.birthDate}
          />
          {showError("birthDate") ? <p className="field-hint">{fieldErrors.birthDate}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="birthTime">
            출생 시간
          </label>
          <input
            className="field disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            disabled={form.isBirthTimeUnknown}
            id="birthTime"
            name="birthTime"
            onBlur={() => setTouched((current) => ({ ...current, birthTime: true }))}
            onChange={(event) => updateForm({ birthTime: event.target.value })}
            type="time"
            value={form.isBirthTimeUnknown ? "" : form.birthTime}
          />
          {showError("birthTime") ? <p className="field-hint">{fieldErrors.birthTime}</p> : null}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          checked={form.isBirthTimeUnknown}
          className="h-4 w-4 accent-[var(--brand)]"
          name="isBirthTimeUnknown"
          onChange={(event) => {
            updateForm({ isBirthTimeUnknown: event.target.checked, birthTime: "" });
            setTouched((current) => ({ ...current, birthTime: false }));
          }}
          type="checkbox"
        />
        출생 시간을 모름
      </label>

      <div>
        <span className="mb-2 block text-sm font-medium text-slate-800">달력 기준</span>
        <div className="grid grid-cols-2 gap-2">
          {calendarOptions.map((option) => (
            <label className="choice" key={option.value}>
              <input
                checked={form.calendarType === option.value}
                name="calendarType"
                onChange={() => {
                  updateForm({ calendarType: option.value });
                  setTouched((current) => ({ ...current, calendarType: true }));
                }}
                type="radio"
                value={option.value}
              />
              {option.label}
            </label>
          ))}
        </div>
        {showError("calendarType") ? <p className="field-hint">{fieldErrors.calendarType}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="birthPlace">
          출생지
        </label>
        <input
          className="field"
          id="birthPlace"
          name="birthPlace"
          onBlur={() => setTouched((current) => ({ ...current, birthPlace: true }))}
          onChange={(event) => updateForm({ birthPlace: event.target.value })}
          placeholder="예: 서울특별시"
          type="text"
          value={form.birthPlace}
        />
        {showError("birthPlace") ? <p className="field-hint">{fieldErrors.birthPlace}</p> : null}
      </div>

      {submitError ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p> : null}

      <button
        className="w-full rounded-md bg-[var(--brand)] px-4 py-3 text-center font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "계산 중입니다..." : "사주 결과 보기"}
      </button>
    </form>
  );
}
