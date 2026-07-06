import type { SajuResult } from "../saju/types";
import { AI_PROMPT_POLICY, type AiPlan, type AiTone, getMaxKoreanChars, getTemperature } from "./promptPolicy";

export type AiSection =
  | "overview"
  | "personality"
  | "health"
  | "wealth"
  | "relationship"
  | "career"
  | "daewoon"
  | "sewoon";

export type CompactSajuForPrompt = Pick<
  SajuResult,
  "pillars" | "fiveElements" | "tenGods" | "twelveShinsal" | "daewoon" | "sewoon"
> & {
  warnings: string[];
};

export type BuildPromptInput = {
  plan: AiPlan;
  section: AiSection;
  tone: AiTone;
  userName?: string;
  saju: SajuResult;
};

export type BuiltPrompt = {
  system: string;
  user: string;
  metadata: {
    plan: AiPlan;
    section: AiSection;
    tone: AiTone;
    maxKoreanChars: number;
    temperature: number;
    excludedFields: string[];
  };
};

export function compactSajuForPrompt(saju: SajuResult): CompactSajuForPrompt {
  return {
    pillars: saju.pillars,
    fiveElements: saju.fiveElements,
    tenGods: saju.tenGods,
    twelveShinsal: saju.twelveShinsal,
    daewoon: saju.daewoon,
    sewoon: saju.sewoon,
    warnings: [
      "Do not infer medical diagnoses.",
      "Do not guarantee financial or investment outcomes.",
      "Do not make deterministic harmful claims about relationships.",
    ],
  };
}

export function buildSajuPrompt({ plan, section, tone, userName, saju }: BuildPromptInput): BuiltPrompt {
  const compactSaju = compactSajuForPrompt(saju);
  const maxKoreanChars = getMaxKoreanChars(plan);
  const temperature = getTemperature(plan);
  const displayName = userName?.trim() || "사용자";

  return {
    system: [
      "당신은 한국어 사주 해석 보조자입니다.",
      "반드시 제공된 compact Saju JSON만 근거로 해석하세요.",
      `응답은 한국어 ${maxKoreanChars}자 이내로 작성하세요.`,
      "건강은 의학적 진단이 아니며 생활 점검 관점으로만 안내하세요.",
      "재물은 투자 수익을 보장하지 말고 선택 전 확인할 점을 제안하세요.",
      "관계는 단정적이거나 해로운 결정론 표현을 피하고 대화와 경계 설정을 권하세요.",
      `금지 항목: ${AI_PROMPT_POLICY.forbidden.join(", ")}.`,
    ].join("\n"),
    user: JSON.stringify({
      request: {
        plan,
        section,
        tone,
        userName: displayName,
      },
      saju: compactSaju,
    }),
    metadata: {
      plan,
      section,
      tone,
      maxKoreanChars,
      temperature,
      excludedFields: ["birthDate", "birthTime", "email", "user_id", "input_hash"],
    },
  };
}
