export type AiPlan = "free_summary" | "pro";

export type AiTone = "warm" | "professional" | "concise";

export const AI_PROMPT_POLICY = {
  maxKoreanChars: {
    free_summary: 1500,
    pro: 2200,
  },
  temperature: {
    free_summary: 0.4,
    pro: 0.5,
  },
  forbidden: [
    "medical_diagnosis",
    "financial_guarantees",
    "deterministic_relationship_claims",
  ],
  requiredDisclaimers: ["health", "wealth", "relationship"],
} as const;

export function getMaxKoreanChars(plan: AiPlan) {
  return AI_PROMPT_POLICY.maxKoreanChars[plan];
}

export function getTemperature(plan: AiPlan) {
  return AI_PROMPT_POLICY.temperature[plan];
}
